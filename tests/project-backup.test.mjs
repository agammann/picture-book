import {test} from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {importFile} from '../src/lib/imports.js';
test('image-containing project backups can exceed the source-document limit',async()=>{
 const json=await readFile(new URL('fixtures/paper-boat.picturebook.json',import.meta.url),'utf8');
 const restored=await importFile({name:'Book.picturebook.json',size:26000000,text:async()=>json});assert.equal(restored.book.pages.length,4);
 await assert.rejects(importFile({name:'Book.picturebook.json',size:64000001}),/64 MB/);
 await assert.rejects(importFile({name:'Source.txt',size:25000001}),/25 MB/);
});
