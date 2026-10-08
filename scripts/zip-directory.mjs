import {Zip,ZipDeflate} from 'fflate';import {createReadStream,openSync,closeSync,writeSync} from 'node:fs';import {readdir} from 'node:fs/promises';import path from 'node:path';
export async function zipDirectory(directory,output){
 const fd=openSync(output,'wx');let resolve,reject;const completed=new Promise((yes,no)=>{resolve=yes;reject=no;});let failed;
 const zip=new Zip((error,data,final)=>{if(error){failed=error;reject(error);return;}try{let offset=0;while(offset<data.length)offset+=writeSync(fd,data,offset,data.length-offset);if(final)resolve();}catch(error){failed=error;reject(error);}});
 const root=path.basename(directory);
 async function walk(relative=''){const files=await readdir(path.join(directory,relative),{withFileTypes:true});for(const file of files.sort((a,b)=>a.name.localeCompare(b.name))){if(file.isSymbolicLink())throw Error('Do not package symbolic links.');const name=path.join(relative,file.name);if(file.isDirectory()){await walk(name);continue;}if(!file.isFile())throw Error('Package only regular files.');const entry=new ZipDeflate(root+'/'+name.replaceAll('\\','/'),{level:6,mtime:new Date('2000-01-01T00:00:00Z')});zip.add(entry);for await(const bytes of createReadStream(path.join(directory,name))){if(failed)throw failed;entry.push(bytes,false);}entry.push(new Uint8Array(),true);}}
 try{await walk();zip.end();await completed;}catch(error){zip.terminate();throw error;}finally{closeSync(fd);}
}
