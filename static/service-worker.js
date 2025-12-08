/// <reference lib="webworker" />

// Service worker for ThriveQuest PWA
// Handles push notifications

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
      requireInteraction: false,
    })
  );
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
