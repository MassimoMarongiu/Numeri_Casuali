// Cache name
const CACHE_NAME = 'generatore-numeri-v1';

// File da mettere in cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/main.js',
  '/static/css/main.css'
];

// Installa il Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercetta le richieste
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - ritorna la risposta dalla cache
        if (response) {
          return response;
        }
        
        // Clona la richiesta
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Controlla se abbiamo ricevuto una risposta valida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clona la risposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Fallback per offline
        return caches.match('/index.html');
      })
  );
});

// Elimina cache vecchie
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});