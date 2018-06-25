if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js')
		.then(r => console.log('SW registered'))
		.catch(console.error);
}
