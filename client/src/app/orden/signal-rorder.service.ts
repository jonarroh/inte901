// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { PushService } from '../push/push.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {



  public hubConnection: HubConnection;

  constructor(private pushService: PushService) {
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
       // Separar el idPedido del estatus y idCliente
  let [idPedido, rest] = message.split(':');
  
  // Separar el estatus del idCliente
  let [estatus, idCliente] = rest.split(',');

  console.log('idPedido:', idPedido);
  console.log('estatus:', estatus);
  console.log('idCliente:', idCliente);


  // Enviar notificación
  let userId = localStorage.getItem('userId');

  if (!userId){
    return;
  }

  if (userId === idCliente){
    this.pushService.pushMessage({
      title: `Tu orden ha sido actualizada`,
      message: `La orden ${idPedido} ha sido actualizada a ${estatus}`,
      url: `http://localhost:4200/estatus/${idPedido}`
    });
  }
    }
    );
  }
}