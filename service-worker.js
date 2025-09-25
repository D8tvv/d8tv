const CACHE_NAME = 'd8-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/img/hero.jpg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request).then(resp=>{
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(cache=> cache.put(e.request, copy));
      return resp;
    }).catch(()=>caches.match('./')))
  );
});
