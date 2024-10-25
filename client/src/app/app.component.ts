import { Component } from '@angular/core';
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
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonDirective, HlmToasterComponent, HttpClientModule],
  providers: [SignalRService, OrdenServiceService, PedidosUserServiceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client';

  name = 'Logger';

  ngOnInit() {
    Logger.debug('logger DEBUG message', { message: 'message' });
    Logger.log('logger INFO message', { message: 'message' });
    Logger.warn('logger WARN message', { message: 'message' });
    Logger.error('logger ERROR message', { message: 'message' });
  }

  constructor(private signalRService: SignalRService, private orderderService: PedidosUserServiceService, private geolocationService: GeolocationService) {

    this.geolocationService.getCurrentPosition().then((position) => {
      console.log('Posición actual:', position);
      if (position) {
        if (this.geolocationService.isLogged()) {
          this.geolocationService.sendLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isLogged: 1,
            token: localStorage.getItem('token') || ''
          });
        }
        else {
          const anonymousToken = this.geolocationService.createAnonymousToken();
          console.log('Token anónimo:', anonymousToken);
          this.geolocationService.sendLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isLogged: 0,
            token: anonymousToken
          });
        }
      }

    })
  }
}
