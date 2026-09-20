const CACHE_NAME = "doble-aguila-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./logo-mini.png",
  "./icon-192.png",
  "./icon-512.png"
];

// Instala el service worker y guarda los archivos base en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Limpia versiones viejas de caché cuando se activa una nueva
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estrategia: responde desde caché primero, y si no está, va a la red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => cached)
      );
    })
  );
});
