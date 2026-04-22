// Updated Service Worker for Hsinkang Bagua Maze
const CACHE_NAME = 'bagua-maze-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

/**
 * Standard fetch handler to satisfy PWA criteria.
 * Includes a catch block to prevent "Failed to fetch" errors from crashing the app.
 */
self.addEventListener('fetch', (event) => {
  // We only intercept GET requests to avoid issues with Firebase/API calls
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch((error) => {
      // If network fails (or blocked by AdBlock), return nothing instead of throwing an error
      console.log('Network request failed, but app remains stable.');
      return; 
    })
  );
});
