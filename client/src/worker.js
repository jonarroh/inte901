self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  console.log('Push recibido:', data);

  const options = {
    body: data.message || 'Notificación',  // data.message
    icon: 'assets/icons/icon-72x72.png',
    badge: 'assets/icons/icon-72x72.png',
    data: {
      url: data.url || '/'                 // data.url
    }
  };

  // Mostrar notificación
  e.waitUntil(
    self.registration.showNotification(data.title || 'Notificación', options) // data.title
  );
});

// Manejar el clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Cerrar la notificación
  const notificationData = event.notification.data;

  // Abrir la URL asociada
  event.waitUntil(
    clients.openWindow(notificationData.url)
  );
});
