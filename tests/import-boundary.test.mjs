import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../server/worker.mjs';
import {readLimited} from '../shared/url-policy.mjs';

test('website import rejects and cancels an oversized streamed request before fetching',async t=>{
 let pulled=0,cancelled=false;
 t.mock.method(globalThis,'fetch',()=>assert.fail('Oversized input must not fetch a website'));
 const body=new ReadableStream({pull(controller){if(pulled>=1024000){controller.close();return;}pulled+=1024;controller.enqueue(new Uint8Array(1024));},cancel(){cancelled=true;}});
 const response=await worker.fetch(new Request('https://picture-book.example/api/import-url',{method:'POST',headers:{Origin:'https://picture-book.example'},body,duplex:'half'}),{});
 assert.equal(response.status,413);assert.match((await response.json()).error,/Request is too large/);assert.ok(pulled<=12288);assert.equal(cancelled,true);
});

test('advertised oversized content cancels its unread body',async()=>{
 let cancelled=false;
 const response=new Response(new ReadableStream({cancel(){cancelled=true;}}),{headers:{'Content-Length':'10001'}});
 await assert.rejects(readLimited(response,10000),/too large/);assert.equal(cancelled,true);
});

