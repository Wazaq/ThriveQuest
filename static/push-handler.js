// Push notification handlers for ThriveQuest PWA
// This file is imported by the Workbox-generated service worker via importScripts

// Push notification handler
self.addEventListener('push', (event) => {
	const data = event.data?.json() ?? {
		title: 'ThriveQuest',
		body: 'Time to check in!'
	};

	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: '/icon.svg',
			badge: '/icon.svg',
			tag: 'thrivequest-notification',
			requireInteraction: false
		})
	);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	event.waitUntil(self.clients.openWindow('/'));
});
