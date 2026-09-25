import {publicUrl,readLimited} from '../shared/url-policy.mjs';
export default {async fetch(request,env){
  const url=new URL(request.url);const json=(status,data)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
  if(url.pathname==='/api/config')return json(200,{local:false,configured:false});
  if(url.pathname==='/api/import-url'){
    if(request.method!=='POST')return json(405,{error:'Method not allowed.'});
    if(request.headers.get('Origin')!==url.origin)return json(403,{error:'Origin not allowed.'});
    try{const raw=await request.text();if(raw.length>10000)throw new Error('Request is too large.');let target=publicUrl(JSON.parse(raw).url);
      for(let i=0;i<5;i++){
        const response=await fetch(target.href,{redirect:'manual',headers:{'Accept':'text/html,text/plain','User-Agent':'PictureBook/0.1'},signal:AbortSignal.timeout(15000)});
        if(response.status>=300&&response.status<400&&response.headers.get('location')){target=publicUrl(new URL(response.headers.get('location'),target).href);continue;}
        if(!response.ok)throw new Error('This website blocks imports. Paste its text or upload a saved document.');
        if(!/text\/(html|plain)/i.test(response.headers.get('content-type')||''))throw new Error('Download this document and upload it as a file.');
        return json(200,{html:await readLimited(response),url:target.href});
      }throw new Error('Too many redirects.');
    }catch(e){return json(400,{error:e.message});}
  }
  if(url.pathname.startsWith('/api/'))return json(404,{error:'Connect your own generation service in Settings.'});
  return env.ASSETS.fetch(request);
}};
