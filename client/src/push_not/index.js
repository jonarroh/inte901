// src/index.js
import { Hono } from "hono";
import { sendNotification } from "./webpush";

const app = new Hono();

// Rutas para manejar las suscripciones
app.post("/subscribe", async (c) => {
  const subscription = await c.req.json();

  // Guarda la suscripción en tu base de datos o en memoria (ejemplo simple)
  // En producción, probablemente quieras almacenar esta info en SQLite o similar.
  const subscriptions = []; // O utiliza una base de datos
  subscriptions.push(subscription);

  return c.json({ message: "Subscribed successfully" }, 201);
});

// Ruta para enviar una notificación (puedes modificarla según tu lógica)
app.post("/send-notification", async (c) => {
  const { subscription, message } = await c.req.json();

  try {
    await sendNotification(
      subscription,
      JSON.stringify({ title: "Nueva notificación", message })
    );
    return c.json({ message: "Notificación enviada" });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error enviando notificación" }, 500);
  }
});

// Inicializa el servidor en un puerto específico con Bun
export default {
  port: 3000,
  fetch: app.fetch,
};
