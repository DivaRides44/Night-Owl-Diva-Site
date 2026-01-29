const CACHE_NAME = 'nightowldiva-v2';
const urlsToCache = [
  '/logo.png',
  '/sheila-nightlife.jpg',
  '/driver-card.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install service worker and cache files (NOT index.html)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Always fetch index.html from network, cache other files
self.addEventListener('fetch', event => {
  // Always get HTML from network
  if (event.request.url.includes('.html') || event.request.url.endsWith('/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }
    )
  );
});

// Update cache when new version is available
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
