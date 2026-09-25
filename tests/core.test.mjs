import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newBook,validateBook,splitSource,validImage} from '../shared/book.mjs';
import {publicUrl,isPublicIP,readLimited} from '../shared/url-policy.mjs';
import {startServer} from '../server/index.mjs';
test('portable projects preserve story data and replace unsafe image sources',()=>{
 const original={...newBook('Example'),pages:[{title:'One',text:'A real story.',image:'https://tracker.example/image.png'}]};
 const result=validateBook(original);assert.equal(result.pages[0].text,'A real story.');assert.equal(result.pages[0].image,'');assert.notEqual(result.id,original.id);
 for(const pages of [[],[null],Array(49).fill({})])assert.throws(()=>validateBook({...original,pages}));
 assert.equal(validImage('data:image/svg+xml;base64,PHN2Zz4='),false);
 assert.equal(validImage('/art/lantern-harbor.webp'),true);
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
 const config=await (await fetch(origin+'/api/config')).json();assert.deepEqual(config,{local:true,configured:true});
 const rejected=await fetch(origin+'/api/openai/responses',{method:'POST',headers:{Origin:'https://unrelated.example','Content-Type':'application/json'},body:'{}'});assert.equal(rejected.status,403);
 assert.equal((await fetch(origin+'/api/openai/unknown',{method:'POST',body:'{}'})).status,404);
 const page=await fetch(origin+'/');assert.equal(page.status,200);assert.match(await page.text(),/Picture Book/);
});
