import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent } from '~/components/ui-carousel-helm/src';
import { ProcessStateComponent } from './process-state/process-state.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ActivatedRoute } from '@angular/router';
import { PedidoStateService } from './pedido-state.service';

@Component({
  selector: 'app-pedido-state',
  standalone: true,
  imports: [
    NavbarComponent, HlmCarouselComponent, HlmCarouselContentComponent, 
    HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent,
    ProcessStateComponent, ProductsListComponent
  ],
  templateUrl: './pedido-state.component.html',
  styleUrl: './pedido-state.component.css'
})
export class PedidoStateComponent implements OnInit{

  productIds: number[] = [];
  orderStatus: string | null = null;

  constructor(private pedidoStateService: PedidoStateService) {}

  ngOnInit(): void {
    this.pedidoStateService.getOrderStatus().subscribe(status => {
      this.orderStatus = status;
      // Asegúrate de que `status` no sea null antes de usarlo
      if (status !== null) {
        localStorage.setItem('orderStatus', status);
      }
    });

    this.pedidoStateService.getProductIds().subscribe(ids => {
      this.productIds = ids;
      // Asegúrate de que `ids` no sea null o undefined antes de usarlo
      if (ids) {
        localStorage.setItem('productIds', JSON.stringify(ids));
      }
    });
  }
}