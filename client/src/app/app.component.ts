import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '../components/ui-button-helm/src/lib/hlm-button.directive';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { SignalRService } from './orden/signal-rorder.service';
import { OrdenServiceService } from './orden/orden-service.service';
import { Order } from '~/lib/types';
import { PedidosUserServiceService } from './pedidos/pedidos-user/pedidos-user-service.service';
import { toast } from 'ngx-sonner';
import { HttpClientModule } from '@angular/common/http';
import { GeolocationService } from './services/geolocation.service';
import { LoggerService as Logger } from '~/logging/logging.service';
import { PushService } from './push/push.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonDirective, HlmToasterComponent, HttpClientModule],
  providers: [SignalRService, OrdenServiceService, PedidosUserServiceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent  {
  title = 'client';

  name = 'Logger';

  

  private sendPushNotification(): void {
    console.log('Enviando notificación de recordatorio');
    this.pushService.pushMessage({
      title: 'Recordatorio',
      message: '¡No olvides tu carrito!',
      url: 'http://localhost:4200/checkout/address' // URL actualizada
    });
  }


  constructor(
    private signalRService: SignalRService,
    private orderderService: PedidosUserServiceService,
    private geolocationService: GeolocationService,
    private pushService: PushService
  ) {
    this.geolocationService.getCurrentPosition()
      .then((position) => {
        console.log('Posición actual:', position);
        console.log('token:', localStorage.getItem('token'));
  
        if (!this.geolocationService.isServiceAvailable()) {
          console.warn('El servicio de geolocalización no está disponible. No se realizarán acciones.');
          return;
        }
  
        if (position) {
          const deviceInfo = this.geolocationService.getDeviceName();
          if (this.geolocationService.isLogged()) {
            this.geolocationService.sendLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              isLogged: 1,
              token: localStorage.getItem('token') || '',
              browser: deviceInfo.browser,
              deviceType: deviceInfo.deviceType
            });
          } else {
            this.geolocationService.sendLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              isLogged: 0,
              token: this.geolocationService.createAnonymousToken(),
              browser: deviceInfo.browser,
              deviceType: deviceInfo.deviceType
            });
          }
        }
      })
      .catch((error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.warn('Permiso de geolocalización denegado por el usuario. No se realizarán acciones.');
        } else {
          console.error('Error al obtener la posición:', error.message);
        }
      });

      const lastUpdate = localStorage.getItem('cartlastupdate');
    if (lastUpdate) {
      const lastUpdateDate = new Date(parseInt(lastUpdate, 10));
      console.log('Última actualización del carrito:', lastUpdateDate);

      // Calcular el tiempo para enviar la notificación
      const oneMinute = 60 * 1000; // 1 minuto en milisegundos
      const timeSinceLastUpdate = Date.now() - lastUpdateDate.getTime();
      console.info(timeSinceLastUpdate >= oneMinute ? 'Ya pasó un minuto' : 'Faltan minutos');

      if (timeSinceLastUpdate >= oneMinute) {
        setTimeout(() => this.sendPushNotification(), 5000);
      } else {
        const remainingTime = oneMinute - timeSinceLastUpdate;
        setTimeout(() => this.sendPushNotification(), remainingTime);
      }
    }
  }

  
  

}
