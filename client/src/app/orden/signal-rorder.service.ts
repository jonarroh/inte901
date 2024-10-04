// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  public hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5275/orderHub', {
        // Configura las opciones del cliente SignalR
        transport: 1, // Establece el transporte, WebSockets en este caso
        withCredentials: true, // Permite el uso de credenciales si es necesario
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err) => console.error('SignalR connection error: ', err));
  }

  private registerOnServerEvents() {
    this.hubConnection.on('ReceiveOrderUpdate', (message: string) => {
      console.log('Order update received: ', message);
      // Aquí puedes manejar el mensaje recibido
    });
  }
}
