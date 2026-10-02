import {newBook,uid} from '../../shared/book.mjs';
import {storySections} from '../../shared/story-sections.mjs';

export async function adaptHosted(source,options,settings,{signal,onProgress=()=>{}}={}){
 const key=settings.apiKey?.trim();
 if(!key)throw Error('Add your OpenAI API key in Settings to use hosted text generation.');
 signal?.throwIfAborted();
 onProgress('Adapting your story with GPT-5.4…');
 const response=await fetch('/api/adapt/visitor',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({source:{name:source.name,text:source.text},options:{spreads:Number(options.spreads),audience:options.audience,language:options.language||'English',mode:options.mode},model:'gpt-5.4'}),signal});
 const data=await response.json().catch(()=>null);
 signal?.throwIfAborted();
 if(!response.ok)throw Error(data?.error||'Hosted text generation could not finish. Your existing book is unchanged.');
 const sections=storySections(source.text,Number(options.spreads));
 if(!data||!Array.isArray(data.pages)||data.pages.length!==sections.length||data.pages.some((page,i)=>page.sourceSection!==i+1))throw Error('The hosted response did not contain the requested source sections. Your existing book is unchanged.');
 const book=newBook(data.title||source.name);
 Object.assign(book,{source,style:options.style,audience:options.audience,language:options.language,characters:data.characters,pages:data.pages.map((page,i)=>({id:uid(),title:page.title,text:page.text,scene:page.scene,sourceNote:`Source section ${i+1} of ${sections.length}: ${sections[i]}`,image:'',alt:page.scene}))});
 return book;
}
