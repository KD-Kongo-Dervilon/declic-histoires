/* Cache de l'application après première visite en HTTPS. */
const VERSION='declic-v3-1-2026-11-01';
const URLS=['./','./index.html','./manifest.webmanifest','./src/styles/main.css','./src/main.js','./src/content/episode01.js','./src/core/engine.js','./src/core/storage.js','./src/core/audio.js','./src/ui/app.js','./assets/scene.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(URLS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(event.request,copy))}return response}))) });
