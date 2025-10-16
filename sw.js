// Estructura básica de un Service Worker



// 1. Nombre del cache y archivos a cachear
const CACHE_NAME = 'mi-cache-v1';
const urlsToCache = [
    "index.html",
    "offline.html"
];


// 2. INSTALL -> se ejecuta al instalar el SW
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});


// 3. ACTIVATE -> se ejecuta al activar el SW
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).catch(() => caches.match('offline.html'));
            })
    );
});


self.addEventListener('push', event => {
    const data = event.data ? event.data.text() : 'Notificación sin texto';
    event.waitUntil(
        self.registration.showNotification("Mi PWA", {body: data})
    );
});
