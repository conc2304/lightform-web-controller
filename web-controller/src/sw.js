// ('use strict');

console.log('Service Worker Here');

const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';


let cacheVersion = 1;
let currentCache = {
  offline: 'offline-cache' + cacheVersion,
};


self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Install');

  event.waitUntil(
    caches.open(currentCache.offline).then(function (cache) {
      return cache.addAll(['./assets/images/logos/Wordmark White.svg', OFFLINE_URL, './index.html', './build/app.css']);
    }),
  );

  self.skipWaiting();
});


self.addEventListener('fetch', event => {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        // Return the offline page
        return caches.match(OFFLINE_URL);
      }),
    );
  }
  else {
    // Respond with everything else if we can
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      }),
    );
  }
});
