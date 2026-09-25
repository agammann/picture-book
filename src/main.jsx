import React from 'react';import {createRoot} from 'react-dom/client';import App from './App';import './styles.css';
createRoot(document.getElementById('root')).render(<App/>);
// Retire the earlier offline installation without touching saved books.
if('serviceWorker'in navigator)navigator.serviceWorker.getRegistrations().then(registrations=>Promise.all(registrations.filter(r=>[r.active,r.waiting,r.installing].some(w=>w&&new URL(w.scriptURL).pathname==='/sw.js')).map(r=>r.unregister()))).catch(()=>{});
if('caches'in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pb-')).map(k=>caches.delete(k)))).catch(()=>{});
