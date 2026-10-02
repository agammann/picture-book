import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateImage} from '../src/lib/browser-images.mjs';

test('stopping an illustration clears its timeout before a retry starts',async t=>{
 const timers=new Set(),workers=[];
 t.mock.method(globalThis,'setTimeout',callback=>{timers.add(callback);return callback;});
 t.mock.method(globalThis,'clearTimeout',callback=>timers.delete(callback));
 const originalWorker=globalThis.Worker;globalThis.Worker=class {constructor(){this.terminated=false;workers.push(this);}postMessage(){}terminate(){this.terminated=true;}};t.after(()=>{if(originalWorker)globalThis.Worker=originalWorker;else delete globalThis.Worker;});
 const first=new AbortController(),pending=generateImage('Fictional blue lantern',{signal:first.signal});
 assert.equal(timers.size,1);first.abort();await assert.rejects(pending,{name:'AbortError'});assert.equal(workers[0].terminated,true);assert.equal(timers.size,0);
 const retry=new AbortController(),next=generateImage('Fictional blue lantern',{signal:retry.signal});assert.equal(workers.length,2);assert.equal(workers[1].terminated,false);assert.equal(timers.size,1);
 retry.abort();await assert.rejects(next,{name:'AbortError'});assert.equal(timers.size,0);
});


test('stopping while an image is converted cannot return a completed illustration',async t=>{
 let worker,reader;
 const originalWorker=globalThis.Worker,originalReader=globalThis.FileReader;
 globalThis.Worker=class{constructor(){worker=this;}postMessage(){}terminate(){}};
 globalThis.FileReader=class{constructor(){reader=this;this.result='data:image/png;base64,AAAA';}readAsDataURL(){}};
 t.after(()=>{if(originalWorker)globalThis.Worker=originalWorker;else delete globalThis.Worker;if(originalReader)globalThis.FileReader=originalReader;else delete globalThis.FileReader;});
 const controller=new AbortController(),pending=generateImage('Fictional lantern',{signal:controller.signal});
 worker.onmessage({data:{type:'result',image:new Blob(['pixels'])}});
 await new Promise(resolve=>setImmediate(resolve));assert(reader);
 controller.abort();reader.onload();
 await assert.rejects(pending,{name:'AbortError'});
});
