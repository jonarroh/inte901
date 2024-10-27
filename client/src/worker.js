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
/*

// Manejar el clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Cerrar la notificación
  const notificationData = event.notification.data;

  // Abrir la URL asociada
  event.waitUntil(
    clients.openWindow(notificationData.url)
  );
});

// Escucha los mensajes desde la página para verificar el carrito
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_CART') {
      const cartData = event.data.cart;
      const currentTime = Date.now();
      
      if (cartData && currentTime - cartData.timestamp > 5 * 60 * 1000) {
          console.log('El carrito no ha cambiado en más de 5 minutos.');
          // Aquí puedes realizar alguna acción, como enviar una notificación
          self.registration.showNotification('Recordatorio', {
              body: 'Tu carrito lleva más de 5 minutos sin cambios.',
              icon: 'assets/icons/icon-72x72.png',
              badge: 'assets/icons/icon-72x72.png'
          });
      }
  }
});

// Resto de la lógica de push
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  console.log('Push recibido:', data);

  const options = {
      body: data.message || 'Notificación', 
      icon: 'assets/icons/icon-72x72.png',
      badge: 'assets/icons/icon-72x72.png',
      data: {
          url: data.url || '/' 
      }
  };

  e.waitUntil(
      self.registration.showNotification(data.title || 'Notificación', options)
  );
});

// Manejar el clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notificationData = event.notification.data;

  event.waitUntil(
      clients.openWindow(notificationData.url)
  );
});*/
