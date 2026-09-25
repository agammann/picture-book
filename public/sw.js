// One-time retirement for browsers that used the former offline version.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith('pb-'))await caches.delete(key);
  await self.registration.unregister();
})()));
