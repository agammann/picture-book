import {get,set,del,keys} from 'idb-keyval';
import {validateBook} from '../../shared/book.mjs';
export async function saveBook(book,{remember=true}={}){const saved=validateBook(book,{preserveIdentity:true});await set('book:'+book.id,{...saved,updatedAt:Date.now()});if(remember)localStorage.setItem('picturebook:last',book.id);}
export async function readBook(id){const saved=await get('book:'+id);if(!saved)return;try{return validateBook(saved,{preserveIdentity:true});}catch{throw new Error('This saved copy could not be opened. Its stored data is untouched. Import an exported project to recover your book.');}}
export async function listBooks({onInvalid=()=>{}}={}){const all=await keys();const books=await Promise.all(all.filter(k=>String(k).startsWith('book:')).map(async k=>{try{return await readBook(String(k).slice(5));}catch{onInvalid(String(k).slice(5));return null;}}));return books.filter(Boolean).sort((a,b)=>b.updatedAt-a.updatedAt);}
export async function removeBook(id){await del('book:'+id);}
export async function storageStatus(){if(navigator.storage?.persist)await navigator.storage.persist();return navigator.storage?.estimate?.();}
