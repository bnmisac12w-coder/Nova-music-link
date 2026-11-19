const CACHE = 'nova-music-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(['/','/logo.svg','/manifest.json']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put('/', copy));
        return response;
      }).catch(() => caches.match('/'))
    );
  }
});
