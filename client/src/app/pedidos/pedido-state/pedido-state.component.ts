import { Component, OnInit, effect } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent } from '~/components/ui-carousel-helm/src';
import { ProcessStateComponent } from './process-state/process-state.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { PedidoStateService } from './pedido-state.service';
import { PedidosUserServiceService } from '../pedidos-user/pedidos-user-service.service';

@Component({
  selector: 'app-pedido-state',
  standalone: true,
  imports: [
    NavbarComponent,
    HlmCarouselComponent,
    HlmCarouselContentComponent,
    HlmCarouselItemComponent,
    HlmCarouselNextComponent,
    HlmCarouselPreviousComponent,
    ProcessStateComponent,
    ProductsListComponent,
  ],
  templateUrl: './pedido-state.component.html',
  styleUrls: ['./pedido-state.component.css']
})
export class PedidoStateComponent implements OnInit {
  productIds: number[] = [];
  orderStatus: string | null = null;

  constructor(
    private pedidoStateService: PedidoStateService,
    private orderService: PedidosUserServiceService
  ) {
    // effect(() => {
    //   this.orderStatus = this.pedidoStateService.orderStatus();
    //   if (this.orderStatus !== null) {
    //     localStorage.setItem('orderStatus', this.orderStatus);
    //   }
    // });

    // // Efecto para sincronizar productIds
    // effect(() => {
    //   this.productIds = this.pedidoStateService.productIds();
    //   if (this.productIds) {
    //     localStorage.setItem('productIds', JSON.stringify(this.productIds));
    //   }
    // });
  }

  ngOnInit(): void {
    // Efecto para sincronizar orderStatus
   
  }
}
