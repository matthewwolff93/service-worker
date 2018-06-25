const version = 4;

self.addEventListener('install', event => {
	// console.log('SW v%s installed at ', version, new Date().toLocaleTimeString());
	// self.skipWaiting();
	event.waitUntil(
		caches.open(version).then(cache => (
			cache.addAll(['/index.js'])
		))
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => {
			Promise.all(keys.filter(key => {
				return key != version;
			}).map(key => {
				return caches.delete(key);
			}));
		})
	);
	// console.log('SW v%s activated at ', version, new Date().toLocaleTimeString())
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			if(response) {
				console.log('Fetched %s from cache', event.request.url);
				return response;
			}

			if(!navigator.onLine) return new Response('<h1>Offline :(</h1>', { headers: { 'Content-Type': 'text/html' } });

			return fetchAndUpdate(event.request);
		})
	);
	// if(!navigator.onLine) {
	//     event.respondWith(new Response('<h1>Offline :(</h1>', { headers: { 'Content-Type': 'text/html' } }));
	// } else {
	//     console.log(event.request.url);
	//     event.respondWith(fetch(event.request));
	// }
});

function fetchAndUpdate(request) {
	return fetch(request).then(response => {
		if(response) {
			return caches.open(version).then(cache => {
				return cache.put(request, response.clone()).then(() => (response));
			});
		}
	});
}
