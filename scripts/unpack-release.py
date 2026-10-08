import argparse, hashlib, json, pathlib, zipfile
parser=argparse.ArgumentParser();parser.add_argument('--out',required=True);args=parser.parse_args()
root=pathlib.Path.cwd();output=pathlib.Path(args.out).resolve();version=json.loads((root/'package.json').read_text(encoding='utf-8'))['version']
if output.exists():raise SystemExit('Use a fresh consumer output folder.')
checks={name:digest for digest,name in (line.split('  ',1) for line in (root/'release-artifacts/SHA256SUMS').read_text().splitlines())}
for kind,suffix in [('source','source'),('windows','windows-x64')]:
 name=f'picture-book_{version}_{suffix}.zip';archive=root/'release-artifacts'/name
 if hashlib.sha256(archive.read_bytes()).hexdigest()!=checks[name]:raise SystemExit('Archive checksum mismatch.')
 target=output/kind;target.mkdir(parents=True)
 with zipfile.ZipFile(archive) as zipped:
  prefixes={pathlib.PurePosixPath(info.filename.replace('\\','/')).parts[0] for info in zipped.infolist()}
  if len(prefixes)!=1:raise SystemExit('Expected one release root.')
  for info in zipped.infolist():
   parts=pathlib.PurePosixPath(info.filename.replace('\\','/')).parts
   if info.filename.startswith('/') or '..' in parts or any(':' in part for part in parts):raise SystemExit('Unsafe archive path.')
   relative=pathlib.Path(*parts[1:]);destination=target/relative
   if info.is_dir():destination.mkdir(parents=True,exist_ok=True)
   elif parts[1:]:destination.parent.mkdir(parents=True,exist_ok=True);destination.write_bytes(zipped.read(info))
print(json.dumps({'version':version,'source':str(output/'source'),'windows':str(output/'windows')}))
