import fs from 'node:fs/promises';
import path from 'node:path';
import {zipSync} from 'fflate';
const root=process.cwd();const output=path.resolve(process.argv[2]||'../../outputs/Picture-Book-Source.zip');
const allowed=['src','public','server','shared','scripts','desktop','tests','docs','examples','.github'];
const files={};
async function walk(relative){for(const item of await fs.readdir(relative,{withFileTypes:true})){if(item.isSymbolicLink())throw new Error('Source package must not contain links.');const name=path.join(relative,item.name);if(item.isDirectory())await walk(name);else files['picture-book/'+name.replaceAll('\\','/')]=new Uint8Array(await fs.readFile(name));}}
for(const dir of allowed)try{await walk(dir);}catch(e){if(e.code!=='ENOENT')throw e;}
for(const name of ['package.json','package-lock.json','pnpm-lock.yaml','index.html','vite.config.js','LICENSE','README.md','.gitignore','.env.example'])try{files['picture-book/'+name]=new Uint8Array(await fs.readFile(name));}catch(e){if(e.code!=='ENOENT')throw e;}
// Generic hosting configuration contains no credentials or account identifiers.
files['picture-book/.openai/hosting.json']=new TextEncoder().encode('{}\n');
await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,zipSync(files,{level:6}));console.log(output);
