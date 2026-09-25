const {app,BrowserWindow,shell}=require('electron');
const path=require('node:path');const {pathToFileURL}=require('node:url');
let server;
if(!app.requestSingleInstanceLock()){app.quit();return;}
app.whenReady().then(async()=>{
  const {startServer}=await import(pathToFileURL(path.join(__dirname,'../server/index.mjs')).href);
  server=await startServer({port:4174,key:'',staticDir:path.join(__dirname,'../dist/client')});
  const origin=`http://127.0.0.1:${server.address().port}`;
  const win=new BrowserWindow({width:1440,height:980,minWidth:760,minHeight:640,title:'Picture Book',backgroundColor:'#f7f5ef',autoHideMenuBar:true,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
  win.webContents.setWindowOpenHandler(({url})=>{if(url.startsWith('https://'))shell.openExternal(url);return {action:'deny'};});
  win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith(origin+'/')){event.preventDefault();if(url.startsWith('https://'))shell.openExternal(url);}});
  win.webContents.session.setPermissionRequestHandler((_webContents,_permission,callback)=>callback(false));
  await win.loadURL(origin);
}).catch(error=>{require('electron').dialog.showErrorBox('Picture Book could not start',error.code==='EADDRINUSE'?'Port 4174 is already in use. Close the other Picture Book process and try again.':error.message);app.quit();});
app.on('window-all-closed',()=>{server?.close();app.quit();});
