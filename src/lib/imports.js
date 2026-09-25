import {unzipSync,strFromU8} from 'fflate';
import {MAX_SOURCE_CHARS,cleanText,validateBook} from '../../shared/book.mjs';
export function textFromHTML(html){const doc=new DOMParser().parseFromString(html,'text/html');doc.querySelectorAll('script,style,nav,header,footer,aside,form,iframe,noscript,svg').forEach(n=>n.remove());const title=doc.querySelector('h1')?.textContent||doc.title||'Web story';const main=doc.querySelector('article')||doc.querySelector('main')||doc.body;main.querySelectorAll('p,div,br,h1,h2,h3,li').forEach(n=>n.append(doc.createTextNode('\n')));return {name:cleanText(title,200),text:cleanText(main.textContent.replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n\n'))};}
export async function importFile(file,onProgress=()=>{}){
  if(file.size>25000000)throw new Error('Please choose a file smaller than 25 MB.');
  const ext=file.name.split('.').pop().toLowerCase();
  if(ext==='json'){const book=validateBook(JSON.parse(await file.text()));return {book};}
  let text='';
  if(ext==='pdf'){
    onProgress('Reading PDF pages…');const pdfjs=await import('pdfjs-dist');const worker=await import('pdfjs-dist/build/pdf.worker.min.mjs?url');pdfjs.GlobalWorkerOptions.workerSrc=worker.default;
    const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,useSystemFonts:true}).promise;
    try{if(pdf.numPages>1500)throw new Error('Please split PDFs longer than 1,500 pages.');for(let n=1;n<=pdf.numPages;n++){onProgress(`Reading PDF page ${n} of ${pdf.numPages}…`);const page=await pdf.getPage(n);const content=await page.getTextContent();text+=content.items.map(i=>i.str+(i.hasEOL?'\n':' ')).join('')+'\n\n';if(text.length>MAX_SOURCE_CHARS)throw new Error('This book is too long. Import a chapter or split it into volumes.');}}finally{await pdf.destroy();}
    if(text.trim().length<40)throw new Error('This PDF appears to contain scanned images. Run OCR first, or paste the text.');
  }else if(ext==='docx'){
    const bytes=new Uint8Array(await file.arrayBuffer());let tooLarge=false;const archive=unzipSync(bytes,{filter:entry=>{if(entry.name!=='word/document.xml')return false;if(entry.originalSize>20000000){tooLarge=true;return false;}return true;}});if(tooLarge)throw new Error('The document is too large.');if(!archive['word/document.xml'])throw new Error('This is not a readable DOCX document.');const doc=new DOMParser().parseFromString(strFromU8(archive['word/document.xml']),'application/xml');if(doc.querySelector('parsererror'))throw new Error('The DOCX document is damaged.');text=[...doc.getElementsByTagName('w:p')].map(p=>[...p.getElementsByTagName('w:t')].map(t=>t.textContent).join('')).join('\n\n');
  }else if(['txt','md'].includes(ext)){text=await file.text();}
  else if(['html','htm'].includes(ext)){return textFromHTML(await file.text());}
  else throw new Error('Choose a PDF, DOCX, TXT, Markdown, HTML, or Picture Book project.');
  if(text.length>MAX_SOURCE_CHARS)throw new Error('This story exceeds 600,000 characters. Import a chapter or split it into volumes.');
  if(!text.trim())throw new Error('No readable text was found in this file.');
  return {name:file.name.replace(/\.[^.]+$/,''),text:cleanText(text)};
}
export async function importWebsite(url,signal){const response=await fetch('/api/import-url',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url}),signal});const data=await response.json();if(!response.ok)throw new Error(data.error||'Website import failed.');return {...textFromHTML(data.html),url:data.url};}
export async function fileToImage(file){if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Use a PNG, JPG, or WebP image.');if(file.size>15000000)throw new Error('Please use an image smaller than 15 MB.');const url=URL.createObjectURL(file);try{const image=await loadImage(url);const scale=Math.min(1,1600/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/webp',.92);}finally{URL.revokeObjectURL(url);}}
export function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('An illustration could not be loaded.'));image.src=src;});}
