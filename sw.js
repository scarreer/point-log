// Keeps the app opening with no signal. Map tiles still need a connection.
const C = 'pointlog-v1';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (hit && r.ok) c.put(e.request, r.clone()); return r; });
    if (hit) { net.catch(() => {}); return hit; }
    return net;
  }));
});
