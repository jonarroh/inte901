import webpush from "web-push";

const app = new Hono();

const publicKey =
  "BFUFx9NEVf7RxPqtc2OkravuE2sJr-BkpNLyo9pm0vBIa1UC4C3PN4aC9D5WD3x4FiogvwE2MX4X5Fk_iuJa2fI";

const privateKey = "1C2D9bYrKTLlgoEoKrkTK8GK9avTdqReX0QbjBxLED0";

webpush.setVapidDetails("fer@example.com", publicKey, privateKey);

// Ruta para suscribirse
export const sendNotification = (subscription, payload) => {
  return webpush.sendNotification(subscription, payload).catch((err) => {
    console.error("Error enviando notificación", err);
  });
};
