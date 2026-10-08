import {execFileSync} from 'node:child_process';import {readFileSync,mkdirSync} from 'node:fs';import path from 'node:path';
const git=args=>execFileSync('git',args,{encoding:'utf8',windowsHide:true}).trim();
if(path.resolve(git(['rev-parse','--show-toplevel']))!==process.cwd()||git(['status','--porcelain','--untracked-files=normal']))throw new Error('Package a clean committed tree from its repository root.');
const pkg=JSON.parse(readFileSync('package.json','utf8'));if(pkg.name!=='picture-book'||pkg.license!=='MIT'||!/^\d+\.\d+\.\d+$/.test(pkg.version))throw new Error('Expected stable Picture Book MIT metadata.');
const hosting=JSON.parse(readFileSync('.openai/hosting.json','utf8'));if(Object.keys(hosting).length)throw new Error('Source release requires generic empty hosting metadata.');
const output=path.resolve(process.argv[2]||`release-artifacts/picture-book_${pkg.version}_source.zip`);mkdirSync(path.dirname(output),{recursive:true});execFileSync('git',['archive','--format=zip',`--prefix=picture-book-${pkg.version}/`,`--output=${output}`,'HEAD'],{windowsHide:true});console.log(output);
