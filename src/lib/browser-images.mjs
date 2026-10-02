import { unloadModel } from './browser-model.mjs';
let worker,active=false;
export function unloadImages(){worker?.terminate();worker=undefined;}
export async function generateImage(prompt,{signal,onProgress=()=>{}}={}){
 if(active)throw Error('An illustration is already running. Wait or stop it first.');
 signal?.throwIfAborted();unloadModel();active=true;
 try{
  if(!worker)worker=new Worker('/browser-image-worker.mjs',{type:'module'});
  const image=await new Promise((resolve,reject)=>{
   let timer;
   const finish=fn=>value=>{clearTimeout(timer);signal?.removeEventListener('abort',stop);fn(value);};
   const stop=()=>{unloadImages();finish(reject)(signal.reason||new DOMException('Stopped.','AbortError'));};
   timer=setTimeout(()=>{unloadImages();finish(reject)(Error('Image generation timed out. Try another device or upload your own art.'))},1200000);
   signal?.addEventListener('abort',stop,{once:true});
   worker.onerror=finish(reject);worker.onmessage=e=>{const m=e.data;if(m.type==='status')onProgress(m.text);if(m.type==='result')finish(resolve)(m.image);if(m.type==='error'){unloadImages();finish(reject)(Error(m.message));}};
   worker.postMessage({prompt});
  });
  signal?.throwIfAborted();const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(image);});signal?.throwIfAborted();return data;
 }catch(e){unloadImages();throw e;}finally{active=false;}
}
