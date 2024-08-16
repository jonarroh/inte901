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

  Orders: Order[] = [];

  constructor(private signalRService: SignalRService,private orderderService: PedidosUserServiceService) {

   this.orderderService.getOrdersByUser(Number(localStorage.getItem('userId'))).subscribe({
      next: (response) => {
        this.Orders = response;
      },
      error: (error) => {
        console.error('Error loading orders', error);
      },
   });


    this.signalRService.hubConnection.on('ReceiveOrderUpdate', (message: string) => {
      const changeId = message.split(':')[0];
      const status = message.split(':')[1];
      if (this.Orders) {
        const order = this.Orders.find(o => o.id === Number(changeId));
        if (order) {
          order.status = status;
          toast.info(`Tu orden ${order.ticket} ha cambiado a ${status}`);
        }
        else return;
      }
    });
    
  }
}
