export const MAX_SOURCE_CHARS = 600000;
export const STYLES = ['Watercolor','Colored pencil','Paper collage','Ink & wash','Soft gouache'];
export const uid = () => globalThis.crypto.randomUUID();
export function newBook(title='Untitled book') { return {format:'picture-book',version:1,id:uid(),title,author:'',style:'Watercolor',audience:'All ages',language:'English',characters:[],referenceImage:'',source:{name:'',text:''},pages:[],updatedAt:Date.now()}; }
export function blankBook() { return {...newBook(),pages:[{id:uid(),title:'Your story starts here',text:'',scene:'',sourceNote:'',image:'',alt:''}]}; }
export function cleanText(value, max=MAX_SOURCE_CHARS) { return String(value??'').replace(/\u0000/g,'').trim().slice(0,max); }
export function validImage(value) { return typeof value==='string' && (value==='' || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value) || /^\/art\/[a-z-]+\.webp$/.test(value)); }
export function validateBook(data) {
  if (!data || data.format!=='picture-book' || data.version!==1 || !Array.isArray(data.pages) || data.pages.length<1 || data.pages.length>48 || data.pages.some(p=>!p||typeof p!=='object')) throw new Error('This is not a supported Picture Book project.');
  const book = newBook(cleanText(data.title,200)||'Untitled book');
  for(const key of ['author','style','audience','language']) book[key]=cleanText(data[key],300)||book[key];
  book.source={name:cleanText(data.source?.name,300),text:cleanText(data.source?.text)};
  book.characters=(Array.isArray(data.characters)?data.characters:[]).slice(0,16).map(c=>({name:cleanText(c.name,100),description:cleanText(c.description,2000)}));
  if(validImage(data.referenceImage)) book.referenceImage=data.referenceImage;
  const castNames=value=>(Array.isArray(value)?value:[]).slice(0,16).map(v=>cleanText(v,100));
  book.referenceCast=castNames(data.referenceCast);
  book.pages=data.pages.map(p=>({id:uid(),title:cleanText(p.title,160),text:cleanText(p.text,3000),scene:cleanText(p.scene,3000),sourceNote:cleanText(p.sourceNote,1000),image:validImage(p.image)?p.image:'',alt:cleanText(p.alt,1000),imageCast:castNames(p.imageCast)}));
  return book;
}
export function splitSource(text, limit=22000) {
  const chunks=[]; let remaining=cleanText(text);
  while(remaining.length>limit){let end=remaining.lastIndexOf('\n',limit);if(end<limit*.6)end=remaining.lastIndexOf(' ',limit);if(end<1)end=limit;chunks.push(remaining.slice(0,end));remaining=remaining.slice(end).trim();}
  if(remaining)chunks.push(remaining);return chunks;
}
export const bookSchema={type:'object',additionalProperties:false,properties:{title:{type:'string'},characters:{type:'array',items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},description:{type:'string'}},required:['name','description']}},pages:{type:'array',items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},text:{type:'string'},scene:{type:'string'},sourceNote:{type:'string'}},required:['title','text','scene','sourceNote']}}},required:['title','characters','pages']};
