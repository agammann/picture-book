import fs from 'node:fs/promises';
await fs.mkdir('dist/server',{recursive:true});
const shared=await fs.readFile('shared/url-policy.mjs','utf8');
const worker=(await fs.readFile('server/worker.mjs','utf8')).replace(/^import[^\n]+\n/,'');
await fs.writeFile('dist/server/index.js',shared+'\n'+worker);
await fs.mkdir('dist/.openai',{recursive:true});await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Website worker built.');
