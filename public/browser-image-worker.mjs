// Pipeline follows the MIT-licensed ONNX Runtime Web SD-Turbo example:
// https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js/sd-turbo
const BASE='https://huggingface.co/schmuell/sd-turbo-ort-web/resolve/ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1';
let ort, tokenizer, sessions;
const status=text=>self.postMessage({type:'status',text});
async function modelBytes(file){
 const url=`${BASE}/${file}`;let cache;
 try{cache=await caches.open('picture-book-sd-turbo-v1');const cached=await cache.match(url);if(cached){status(`Loading cached ${file}…`);return cached.arrayBuffer();}}catch{}
 status(`Downloading ${file}…`);const r=await fetch(url);if(!r.ok)throw Error('The image model could not download. Check your connection and retry.');
 if(cache){try{await cache.put(url,r.clone())}catch{status('Browser cache is full. Loading without saving this model file…');}}
 return r.arrayBuffer();
}
async function load(){
 if(sessions)return;
 if(!navigator.gpu||!await navigator.gpu.requestAdapter())throw Error('Browser illustration needs WebGPU and a compatible graphics device. Upload your own art or try another device.');
 const runtime=await import('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.webgpu.min.mjs');ort=runtime;
 ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';ort.env.wasm.numThreads=1;
 const {AutoTokenizer,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js');env.allowLocalModels=false;
 tokenizer=await AutoTokenizer.from_pretrained('Xenova/clip-vit-base-patch16');tokenizer.pad_token_id=0;
 sessions={};const opt={executionProviders:['webgpu'],enableMemPattern:false,enableCpuMemArena:false,extra:{session:{disable_prepacking:'1',use_device_allocator_for_initializers:'1',use_ort_model_bytes_directly:'1',use_ort_model_bytes_for_initializers:'1'}}};
 for(const [name,dims] of [['text_encoder',{batch_size:1}],['unet',{batch_size:1,num_channels:4,height:64,width:64,sequence_length:77}],['vae_decoder',{batch_size:1,num_channels_latent:4,height_latent:64,width_latent:64}]]){
  const bytes=await modelBytes(`${name}/model.onnx`);status(`Preparing ${name} on your graphics device…`);sessions[name]=await ort.InferenceSession.create(bytes,{...opt,freeDimensionOverrides:dims});
 }
 status('Image model ready. Drawing on your device…');
}
async function draw(prompt){
 await load();const encoded=await tokenizer(prompt,{padding:'max_length',max_length:77,truncation:true,return_tensor:false});const input_ids=Array.from(encoded.input_ids).slice(0,77);while(input_ids.length<77)input_ids.push(0);
 const hidden=await sessions.text_encoder.run({input_ids:new ort.Tensor('int32',Int32Array.from(input_ids),[1,input_ids.length])});
 const size=4*64*64,sigma=14.6146,scale=Math.sqrt(sigma*sigma+1),latent=new Float32Array(size),scaled=new Float32Array(size);
 for(let i=0;i<size;i++){const u=Math.max(Number.MIN_VALUE,Math.random()),v=Math.random();latent[i]=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)*sigma;scaled[i]=latent[i]/scale;}
 status('Drawing a 512 × 512 illustration on your device…');
 const unet=await sessions.unet.run({sample:new ort.Tensor('float32',scaled,[1,4,64,64]),timestep:new ort.Tensor('int64',BigInt64Array.from([999n]),[1]),encoder_hidden_states:hidden.last_hidden_state});
 const decoded=new Float32Array(size);for(let i=0;i<size;i++)decoded[i]=(latent[i]-sigma*unet.out_sample.data[i])/0.18215;
 const output=await sessions.vae_decoder.run({latent_sample:new ort.Tensor('float32',decoded,[1,4,64,64])});
 const rgb=output.sample.data,pixels=new Uint8ClampedArray(512*512*4),plane=512*512;
 for(let i=0;i<plane;i++){for(let c=0;c<3;c++)pixels[i*4+c]=Math.round(Math.max(0,Math.min(1,rgb[c*plane+i]/2+0.5))*255);pixels[i*4+3]=255;}
 const canvas=new OffscreenCanvas(512,512);canvas.getContext('2d').putImageData(new ImageData(pixels,512,512),0,0);
 const image=await canvas.convertToBlob({type:'image/png'});
 for(const values of [hidden,unet,output])for(const tensor of Object.values(values))tensor.dispose();
 return image;
}
self.onmessage=async event=>{try{const image=await draw(event.data.prompt);self.postMessage({type:'result',image});}catch(e){self.postMessage({type:'error',message:e.message||'Browser illustration failed. Existing art is safe.'});}};
