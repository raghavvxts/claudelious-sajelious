// A minimal service worker to satisfy Chrome's PWA installability requirements
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We don't need offline support, we just need the fetch listener to exist 
  // so Chrome recognizes this as a valid Progressive Web App.
});
