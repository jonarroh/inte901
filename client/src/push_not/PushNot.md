# Dependencies

bun i web-push hono

# Web Push

Para generar llaves para el uso de web-push corres el comando:
bun run web-push generate-vapid-keys

Este archivo se encarga de configurar las claves VAPID necesarias para enviar notificaciones push usando el paquete web-push. Contiene la función sendNotification que utiliza web-push para enviar notificaciones a un cliente suscrito.

# Index.js

Este archivo maneja el backend de la aplicación.
Ruta /subscribe: Recibe una suscripción del cliente y la almacena. Esta es la ruta que los clientes deben llamar para suscribirse a las notificaciones push.
Ruta /send-notification: Permite enviar una notificación a una suscripción específica. Recibe la suscripción y un mensaje, luego utiliza sendNotification para enviar la notificación al cliente.

# Service-worker

Este archivo es el service worker, encargado de manejar la recepción y el comportamiento de las notificaciones en el lado del cliente.

# Repo del video

https://github.com/FaztWeb/node-web-push-notifaction
