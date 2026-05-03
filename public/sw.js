const CACHE_NAME = 'gasket-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './sketch.js',
  './Complex.js',
  './Circle.js',
  './mathUtils.js',
  './Gasket.js',
  './icon.svg',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit
        }
        return fetch(event.request);
      })
  );
});
