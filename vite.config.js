import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],resolve:{preserveSymlinks:process.env.PICTURE_BOOK_LINKED_DEPS==='1'},build:{outDir:'dist/client',emptyOutDir:true},server:{proxy:{'/api':'http://127.0.0.1:4173'}},base:'./'});
