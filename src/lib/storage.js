import {get,set,del,keys} from 'idb-keyval';
export async function saveBook(book){await set('book:'+book.id,{...book,updatedAt:Date.now()});localStorage.setItem('picturebook:last',book.id);}
export async function readBook(id){return get('book:'+id);}
export async function listBooks(){const all=await keys();const books=await Promise.all(all.filter(k=>String(k).startsWith('book:')).map(k=>get(k)));return books.filter(Boolean).sort((a,b)=>b.updatedAt-a.updatedAt);}
export async function removeBook(id){await del('book:'+id);}
export async function storageStatus(){if(navigator.storage?.persist)await navigator.storage.persist();return navigator.storage?.estimate?.();}
