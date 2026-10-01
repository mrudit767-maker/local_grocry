const CACHE_NAME = 'krishna-kirana-v4';
const ASSETS = [
  '/logo.png',
  '/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Purge ALL older caches immediately upon activation
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Purging legacy Service Worker cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only handle GET requests originating from this host
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  const isHtmlNavigation = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) ||
    url.pathname === '/' ||
    url.pathname === '/index.html';

  // Strategy 1: For HTML documents and main site navigation, ALWAYS use NETWORK-FIRST
  // This guarantees new deployments on Vercel are immediately loaded without caching white screens
  if (isHtmlNavigation) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // If network is completely offline, fall back to cached index.html
          return caches.match(event.request).then(cached => cached || caches.match('/index.html') || caches.match('/'));
        })
    );
    return;
  }

  // Strategy 2: For static assets (images, icons, styles), use Cache-First with network fallback
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const copy = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return networkResponse;
      });
    })
  );
});
