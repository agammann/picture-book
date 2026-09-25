import {validateBook} from '../../shared/book.mjs';
export async function loadShowcase(){
  const response=await fetch('/showcase/alice.picturebook.json');
  if(!response.ok)throw new Error('The showcase could not be loaded. You can still start your own book.');
  const book=validateBook(await response.json());
  book.id='alice-showcase';
  return book;
}
