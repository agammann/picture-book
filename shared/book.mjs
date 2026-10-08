export const MAX_SOURCE_CHARS = 600000;
export const MAX_PROJECT_BYTES = 64000000;
export const STYLES = ['Watercolor','Colored pencil','Paper collage','Ink & wash','Soft gouache'];
export const uid = () => globalThis.crypto.randomUUID();
export function newBook(title='Untitled book') { return {format:'picture-book',version:1,id:uid(),title,author:'',style:'Watercolor',audience:'All ages',language:'English',characters:[],referenceImage:'',source:{name:'',text:''},pages:[],updatedAt:Date.now()}; }
export function blankBook() { return {...newBook(),pages:[{id:uid(),title:'Your story starts here',text:'',scene:'',sourceNote:'',image:'',alt:''}]}; }
export function cleanText(value, max=MAX_SOURCE_CHARS) { return String(value??'').replace(/\u0000/g,'').trim().slice(0,max); }
export function validImage(value) { return typeof value==='string' && (value==='' || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value) || /^\/art\/[a-z-]+\.webp$/.test(value)); }
function projectText(value, max, label) {
  if (value == null) return '';
  if (typeof value !== 'string' || value.length > max || value.includes('\u0000')) throw new Error(`The project has invalid ${label}. No saved copy was changed.`);
  return value;
}
export function validateBook(data, {preserveIdentity=false}={}) {
  if (!data || data.format!=='picture-book' || data.version!==1 || !Array.isArray(data.pages) || data.pages.length<1 || data.pages.length>48 || data.pages.some(p=>!p||typeof p!=='object')) throw new Error('This is not a supported Picture Book project.');
  const book = newBook(projectText(data.title,200,'title')||'Untitled book');
  for(const key of ['author','style','audience','language']) book[key]=projectText(data[key],300,key)||book[key];
  book.source={name:projectText(data.source?.name,300,'source name'),text:projectText(data.source?.text,MAX_SOURCE_CHARS,'original source')};
  if(data.source?.url){const url=new URL(projectText(data.source.url,4000,'source URL'));if(url.protocol!=='https:'||url.username||url.password)throw new Error('The project has an unsupported source URL.');book.source.url=url.href;}
  book.characters=(Array.isArray(data.characters)?data.characters:[]).slice(0,16).map(c=>({name:projectText(c?.name,100,'character name'),description:projectText(c?.description,2000,'character description')}));
  if(validImage(data.referenceImage)) book.referenceImage=data.referenceImage;
  const castNames=value=>(Array.isArray(value)?value:[]).slice(0,16).map(v=>projectText(v,100,'illustration character name'));
  book.referenceCast=castNames(data.referenceCast);
  book.pages=data.pages.map(p=>({id:uid(),title:projectText(p.title,160,'spread title'),text:projectText(p.text,3000,'spread text'),scene:projectText(p.scene,3000,'scene direction'),sourceNote:projectText(p.sourceNote,MAX_SOURCE_CHARS,'source note'),image:validImage(p.image)?p.image:'',alt:projectText(p.alt,1000,'image description'),imageCast:castNames(p.imageCast)}));
  if(preserveIdentity){
    if(data.pages.some(p=>!validImage(p.image??''))||!validImage(data.referenceImage??''))throw new Error('This saved book has an invalid illustration.');
    const id=projectText(data.id,200,'saved book identity');if(!id)throw new Error('This saved book has no identity.');book.id=id;
    const ids=data.pages.map(p=>projectText(p.id,200,'saved spread identity'));
    if(ids.some(id=>!id)||new Set(ids).size!==ids.length)throw new Error('This saved book has invalid spread identities.');
    book.pages.forEach((p,i)=>{p.id=ids[i];});
    book.updatedAt=Number.isFinite(data.updatedAt)?data.updatedAt:Date.now();
  }
  return book;
}
export function splitSource(text, limit=22000) {
  const chunks=[]; let remaining=cleanText(text);
  while(remaining.length>limit){let end=remaining.lastIndexOf('\n',limit);if(end<limit*.6)end=remaining.lastIndexOf(' ',limit);if(end<1)end=limit;chunks.push(remaining.slice(0,end));remaining=remaining.slice(end).trim();}
  if(remaining)chunks.push(remaining);return chunks;
}
export const bookSchema={type:'object',additionalProperties:false,properties:{title:{type:'string'},characters:{type:'array',items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},description:{type:'string'}},required:['name','description']}},pages:{type:'array',items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},text:{type:'string'},scene:{type:'string'},sourceNote:{type:'string'}},required:['title','text','scene','sourceNote']}}},required:['title','characters','pages']};
