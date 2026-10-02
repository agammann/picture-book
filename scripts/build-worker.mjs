import fs from 'node:fs/promises';
import {build} from 'esbuild';
await fs.mkdir('dist/server',{recursive:true});
await build({entryPoints:['server/worker.mjs'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022'});
await fs.mkdir('dist/.openai',{recursive:true});await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Website worker built.');
