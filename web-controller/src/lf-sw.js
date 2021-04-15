('use strict');

importScripts('workbox-v6.1.2/workbox-sw.js');

console.log('Service Worker Here');

self.__WB_MANIFEST;

let CACHE_NAME = 'offline';
let OFFLINE_URL = 'offline.html';
let cacheVersion = 1;
let currentCache = {
  offline: 'offline-cache' + cacheVersion,
};

self.addEventListener('message', ({ data }) => {
  if (data === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.workbox.precaching.precacheAndRoute([]);

self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Install');

  event.waitUntil(
    caches.open(currentCache.offline).then(function (cache) {
      return cache.addAll([
        './assets/images/logos/Wordmark White.svg',
        './assets/images/logos/Logomark Black@57px.png',
        OFFLINE_URL,
        './index.html',
        './build/app.css',
      ]);
    })
  );

  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (
    event.request.mode === 'navigate' ||
    (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))
  ) {
    event.respondWith(
      fetch(event.request.url).catch((error) => {
        // Return the offline page
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    // Respond with everything else if we can
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});
