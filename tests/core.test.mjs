import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newBook,validateBook,splitSource,validImage} from '../shared/book.mjs';
import {publicUrl,isPublicIP,readLimited} from '../shared/url-policy.mjs';
import {startServer} from '../server/index.mjs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {sceneCharacters,sceneReference} from '../shared/illustration.mjs';
test('illustration references cannot bring absent characters into a scene',()=>{
 const book={characters:[{name:'Time Traveller'},{name:'Weena'},{name:'Morlocks (group)'}],pages:[],referenceImage:'old-sheet'};
 const page={id:'ending',scene:'The Time Traveller stands alone in the forest.'};
 const cast=sceneCharacters(book,page);assert.deepEqual(cast,[{name:'Time Traveller'}]);
 book.pages=[{id:'earlier',image:'with-Weena',imageCast:['Time Traveller','Weena']}];
 assert.equal(sceneReference(book,page,cast),'');
 book.pages.push({id:'alone',image:'traveller-only',imageCast:['Time Traveller']});
 assert.equal(sceneReference(book,page,cast),'traveller-only');
 assert.deepEqual(sceneCharacters({characters:[{name:'Mouse'},{name:'Dormouse'}]},{scene:'The Dormouse sleeps.'}),[{name:'Dormouse'}]);
 assert.deepEqual(sceneCharacters(book,{scene:'Morlocks wait below.'}),[{name:'Morlocks (group)'}]);
});
test('portable projects preserve story data and replace unsafe image sources',()=>{
 const original={...newBook('Example'),pages:[{title:'One',text:'A real story.',image:'https://tracker.example/image.png'}]};
 const result=validateBook(original);assert.equal(result.pages[0].text,'A real story.');assert.equal(result.pages[0].image,'');assert.notEqual(result.id,original.id);
 for(const pages of [[],[null],Array(49).fill({})])assert.throws(()=>validateBook({...original,pages}));
 assert.equal(validImage('data:image/svg+xml;base64,PHN2Zz4='),false);
 assert.equal(validImage('/art/coastal-flowers.webp'),true);
});
test('long source splitting keeps every word in order',()=>{
 const source=Array.from({length:14000},(_,i)=>`word${i}`).join(' ');const parts=splitSource(source);assert.ok(parts.length>1);assert.ok(parts.every(p=>p.length<=22000));assert.equal(parts.join(' '),source);
});
test('website import accepts public HTTPS names only',()=>{
 assert.equal(publicUrl('https://example.com/story#part').href,'https://example.com/story');
 for(const url of ['http://example.com','https://localhost','https://127.0.0.1','https://[::1]','https://user:pass@example.com','https://example.com:8080','https://service.internal'])assert.throws(()=>publicUrl(url));
 for(const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','192.168.1.1','172.16.0.1','100.64.0.1','::1'])assert.equal(isPublicIP(ip),false);
 assert.equal(isPublicIP('93.184.216.34'),true);
});
test('website import enforces response size even without a content-length',async()=>{
 assert.equal(await readLimited(new Response('hello'),5),'hello');
 await assert.rejects(readLimited(new Response('too large'),5),/too large/);
});
test('local server serves editor, rejects foreign origins and never returns its key',async t=>{
 const server=await startServer({port:0,key:'test-only-noncredential'});t.after(()=>new Promise(resolve=>server.close(resolve)));
 const origin=`http://127.0.0.1:${server.address().port}`;
 const config=await (await fetch(origin+'/api/config')).json();assert.deepEqual(config,{local:true,configured:true,localExports:true});
 const rejected=await fetch(origin+'/api/openai/responses',{method:'POST',headers:{Origin:'https://unrelated.example','Content-Type':'application/json'},body:'{}'});assert.equal(rejected.status,403);
 assert.equal((await fetch(origin+'/api/openai/unknown',{method:'POST',body:'{}'})).status,404);
 const page=await fetch(origin+'/');assert.equal(page.status,200);assert.match(await page.text(),/Picture Book/);
});
test('local exports save exact bytes, preserve earlier copies and require the app origin',async t=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'picture-book-export-'));
 const server=await startServer({port:0,exportDirectory:directory});
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});});
 const origin=`http://127.0.0.1:${server.address().port}`;
 const save=extra=>fetch(origin+'/api/export',{method:'POST',headers:{Origin:origin,'X-Picture-Book-Filename':'Example.picturebook.json',...extra},body:'{"story":"complete"}'});
 const first=await (await save()).json(),second=await (await save()).json();
 assert.equal(first.saved,true);assert.notEqual(first.path,second.path);
 assert.equal(await fs.readFile(first.path,'utf8'),'{"story":"complete"}');
 assert.equal((await save({Origin:'https://unrelated.example'})).status,403);
});
