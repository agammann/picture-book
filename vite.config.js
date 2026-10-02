import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],resolve:{preserveSymlinks:process.env.PICTURE_BOOK_LINKED_DEPS==='1'},build:{outDir:'dist/client',emptyOutDir:true},server:{strictPort:true,proxy:{'/api':{target:'http://127.0.0.1:4173',changeOrigin:true,configure(proxy){proxy.on('proxyReq',(outgoing,incoming)=>{
  const host=incoming.headers.host;
  if(['127.0.0.1:5173','localhost:5173'].includes(host)&&incoming.headers.origin===`http://${host}`)outgoing.setHeader('Origin','http://127.0.0.1:4173');
});}}}},base:'./'});
