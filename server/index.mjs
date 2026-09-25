import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns/promises';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {publicUrl,isPublicIP} from '../shared/url-policy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json','.wasm':'application/wasm'};
export function pinnedLookup(addresses){return (_hostname,options,callback)=>{if(options?.all)callback(null,addresses.map(address=>({address,family:4})));else callback(null,addresses[0],4);};}
async function body(req,limit=25000000){let out=[];let size=0;for await(const c of req){size+=c.length;if(size>limit)throw new Error('Request is too large.');out.push(c);}return Buffer.concat(out);}
async function website(input,depth=0){
  if(depth>4)throw new Error('Too many redirects.');const url=publicUrl(input);
  const addresses=await dns.resolve4(url.hostname);if(!addresses.length||addresses.some(a=>!isPublicIP(a)))throw new Error('This address is not a public website.');
  return new Promise((resolve,reject)=>{const req=https.get(url,{headers:{'User-Agent':'PictureBook/0.1 (story import)','Accept':'text/html,text/plain'},lookup:pinnedLookup(addresses),timeout:15000},res=>{
    if(res.statusCode>=300&&res.statusCode<400&&res.headers.location){res.resume();website(new URL(res.headers.location,url).href,depth+1).then(resolve,reject);return;}
    if(res.statusCode!==200){res.resume();reject(new Error('The website did not allow this import. Paste its text or upload a saved document.'));return;}
    if(!/text\/(html|plain)/i.test(res.headers['content-type']||'')){res.resume();reject(new Error('This link is not an HTML or text page. Download the document and upload it instead.'));return;}
    let size=0;const chunks=[];res.on('data',c=>{size+=c.length;if(size>3000000){req.destroy(new Error('This page is too large.'));return;}chunks.push(c);});res.on('end',()=>resolve({html:Buffer.concat(chunks).toString('utf8'),url:url.href}));res.on('error',reject);
  });req.on('timeout',()=>req.destroy(new Error('The website took too long to respond.')));req.on('error',reject);});
}
export async function startServer({port=4173,key=process.env.OPENAI_API_KEY||'',staticDir=path.join(root,'dist/client'),exportDirectory=path.join(os.homedir(),'Downloads','Picture Book')}={}){
  let server;server=http.createServer(async(req,res)=>{
    const json=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(value));};
    try{
      const actualPort=server.address().port;const origin=`http://127.0.0.1:${actualPort}`;
      if(req.headers.host!==`127.0.0.1:${actualPort}`&&req.headers.host!==`localhost:${actualPort}`){json(403,{error:'Invalid host.'});return;}
      const url=new URL(req.url,origin);
      if(url.pathname.startsWith('/api/')){
        const incomingOrigin=req.headers.origin;
        if(incomingOrigin && ![origin,`http://localhost:${actualPort}`,'http://127.0.0.1:5173'].includes(incomingOrigin)){json(403,{error:'Origin not allowed.'});return;}
        if(url.pathname==='/api/config'&&req.method==='GET'){json(200,{local:true,configured:!!key,localExports:true});return;}
        if(req.method!=='POST'){json(405,{error:'Method not allowed.'});return;}
        if(url.pathname==='/api/export'){
          if(![origin,`http://localhost:${actualPort}`,'http://127.0.0.1:5173'].includes(incomingOrigin)){json(403,{error:'Open Picture Book to save an export.'});return;}
          const name=decodeURIComponent(req.headers['x-picture-book-filename']||'');
          if(!name||name.length>120||/[<>:"/\\|?*\x00-\x1f]/.test(name)||!(/\.picturebook\.json$|\.pdf$|\.png$/i.test(name))){json(400,{error:'Unsupported export filename.'});return;}
          const bytes=await body(req,64000000);await fs.promises.mkdir(exportDirectory,{recursive:true});
          const ext=path.extname(name),stem=name.slice(0,-ext.length);let saved;
          for(let n=0;n<1000;n++){const candidate=path.join(exportDirectory,n?`${stem} (${n})${ext}`:name);try{await fs.promises.writeFile(candidate,bytes,{flag:'wx'});saved=candidate;break;}catch(e){if(e.code!=='EEXIST')throw e;}}
          if(!saved)throw new Error('Too many exports with this name. Choose a different book title.');
          json(200,{saved:true,path:saved});return;
        }
        if(url.pathname==='/api/import-url'){const {url:source}=JSON.parse(await body(req,10000));json(200,await website(source));return;}
        if(url.pathname.startsWith('/api/openai/')){
          if(!key){json(401,{error:'Connect your OpenAI key in Settings.'});return;}
          const endpoint=url.pathname.slice('/api/openai/'.length);
          if(!['responses','images/generations','images/edits','moderations'].includes(endpoint)){json(404,{error:'Unknown endpoint.'});return;}
          const payload=await body(req);const aborter=new AbortController();res.on('close',()=>{if(!res.writableEnded)aborter.abort();});
          const result=await fetch('https://api.openai.com/v1/'+endpoint,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':req.headers['content-type']||'application/json'},body:payload,signal:AbortSignal.any([aborter.signal,AbortSignal.timeout(240000)])});
          res.writeHead(result.status,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(await result.text());return;
        }
        if(url.pathname.startsWith('/api/local/')){
          const service=url.pathname.slice('/api/local/'.length);
          const targets={story:'http://127.0.0.1:11434/api/generate',image:'http://127.0.0.1:7860/sdapi/v1/txt2img'};
          if(!targets[service]){json(404,{error:'Unknown local service.'});return;}
          const result=await fetch(targets[service],{method:'POST',headers:{'Content-Type':'application/json'},body:await body(req),signal:AbortSignal.timeout(300000)});
          res.writeHead(result.status,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(await result.text());return;
        }
        json(404,{error:'Unknown endpoint.'});return;
      }
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
      const decoded=decodeURIComponent(url.pathname);let file=path.resolve(staticDir,'.'+decoded);
      if(!file.startsWith(path.resolve(staticDir)+path.sep)&&file!==path.resolve(staticDir)){res.writeHead(403).end();return;}
      if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
      if(!fs.existsSync(file))file=path.join(staticDir,'index.html');
      res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
      res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');
      if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file).pipe(res);
    }catch(e){json(400,{error:e.message==='fetch failed'?'The service could not be reached. Check its connection and try again.':e.message});}
  });await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});return server;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const server=await startServer();console.log(`Picture Book: http://127.0.0.1:${server.address().port}`);}
