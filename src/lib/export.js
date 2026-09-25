import {PDFDocument} from 'pdf-lib/dist/pdf-lib.esm.min.js';
import {loadImage} from './imports';
export async function download(blob,name){
  const config=await fetch('/api/config').then(r=>r.ok?r.json():{}).catch(()=>({}));
  let savedPath='';
  if(config.localExports){const response=await fetch('/api/export',{method:'POST',headers:{'Content-Type':blob.type,'X-Picture-Book-Filename':encodeURIComponent(name)},body:blob});const result=await response.json();if(!response.ok)throw new Error(result.error||'The export could not be saved.');savedPath=result.path;}
  const previous=document.getElementById('picture-book-download');if(previous?.querySelector('a'))URL.revokeObjectURL(previous.querySelector('a').href);
  document.getElementById('picture-book-download')?.remove();
  const url=URL.createObjectURL(blob),panel=document.createElement('aside'),link=document.createElement('a'),close=document.createElement('button');
  panel.id='picture-book-download';panel.className='download-ready';panel.setAttribute('aria-label','Download ready');
  link.href=url;link.download=name;link.textContent=savedPath?'Saved to '+savedPath:'Save '+name;close.textContent='×';close.setAttribute('aria-label','Close download');
  close.onclick=()=>{panel.remove();URL.revokeObjectURL(url);};panel.append(link,close);document.body.appendChild(panel);
  if(!savedPath)link.click();
}
export const filename=title=>(title||'Picture Book').replace(/[<>:"/\\|?*\x00-\x1f]/g,'').slice(0,80).trim()||'Picture Book';
async function imageData(src){if(src.startsWith('data:'))return src;const blob=await (await fetch(src)).blob();return new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(blob);});}
export async function portableBook(book){return {...book,referenceImage:book.referenceImage?await imageData(book.referenceImage):'',pages:await Promise.all(book.pages.map(async p=>({...p,image:p.image?await imageData(p.image):''})))};}
export async function exportProject(book){const data=await portableBook(book);await download(new Blob([JSON.stringify(data)],{type:'application/json'}),filename(book.title)+'.picturebook.json');}
function wrap(ctx,text,maxWidth){const lines=[];for(const paragraph of text.split('\n')){let line='';for(const word of paragraph.split(/\s+/)){if(ctx.measureText(word).width>maxWidth){if(line){lines.push(line);line='';}for(const letter of word){if(ctx.measureText(line+letter).width>maxWidth){lines.push(line);line='';}line+=letter;}continue;}const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word;}else line=next;}lines.push(line);}return lines;}
export async function renderPage(book,index,side,{size=1600}={}){await document.fonts.ready;const height=Math.round(size*1.4);const canvas=document.createElement('canvas');canvas.width=size;canvas.height=height;const ctx=canvas.getContext('2d');ctx.fillStyle='#faf8f1';ctx.fillRect(0,0,size,height);const page=book.pages[index];
  if(side==='art'){if(page.image){const img=await loadImage(page.image);const scale=Math.max(size/img.width,height/img.height);ctx.drawImage(img,(size-img.width*scale)/2,(height-img.height*scale)/2,img.width*scale,img.height*scale);}else{ctx.fillStyle='#46505b';ctx.font=`${size*.04}px Georgia`;ctx.textAlign='center';ctx.fillText(page.title||'Illustration',size/2,height/2);}}
  else{const x=size*.13,w=size*.74;ctx.fillStyle='#242b32';ctx.textAlign='left';let headingSize=size*.074;let heading;do{ctx.font=`${headingSize}px Georgia`;heading=wrap(ctx,page.title,w);if(heading.length<=4)break;headingSize-=2;}while(headingSize>28);let y=height*.2;for(const line of heading){ctx.fillText(line,x,y);y+=headingSize*1.25;}y+=size*.065;
    let fontSize=size*.048,lines;do{ctx.font=`${fontSize}px Georgia`;lines=wrap(ctx,page.text,w);if(y+lines.length*fontSize*1.6<height*.79)break;fontSize-=2;}while(fontSize>14);if(y+lines.length*fontSize*1.6>=height*.88)throw new Error(`The text on spread ${index+1} is too long to export. Shorten it or split it across pages.`);for(const line of lines){ctx.fillText(line,x,y);y+=fontSize*1.6;}
    const flowers=await loadImage('/art/coastal-flowers.webp');const fw=size*.3,fh=flowers.height/flowers.width*fw;ctx.drawImage(flowers,size-fw,height*.9-fh,fw,fh);ctx.font=`${size*.025}px Georgia`;ctx.fillStyle='#687079';ctx.fillText(String(index*2+2),size*.9,height*.95);
  }return canvas;
}
export async function exportPDF(book,onProgress=()=>{},signal){const pdf=await PDFDocument.create();pdf.setTitle(book.title);if(book.author)pdf.setAuthor(book.author);pdf.setCreator('Picture Book');for(let i=0;i<book.pages.length;i++){for(const side of ['art','text']){signal?.throwIfAborted();onProgress(`Preparing page ${i*2+(side==='art'?1:2)} of ${book.pages.length*2}…`);const canvas=await renderPage(book,i,side);const bytes=await (await fetch(canvas.toDataURL('image/jpeg',.94))).arrayBuffer();const img=await pdf.embedJpg(bytes);const page=pdf.addPage([450,630]);page.drawImage(img,{x:0,y:0,width:450,height:630});await new Promise(resolve=>setTimeout(resolve,0));}}signal?.throwIfAborted();await download(new Blob([await pdf.save()],{type:'application/pdf'}),filename(book.title)+'.pdf');}
export async function exportPage(book,index){const canvas=await renderPage(book,index,'art');const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));await download(blob,filename(book.title)+'-illustration-'+(index+1)+'.png');}
