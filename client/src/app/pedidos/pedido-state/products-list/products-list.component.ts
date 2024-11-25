import { Component, OnInit, effect } from '@angular/core';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent } from '~/components/ui-carousel-helm/src';
import { PedidoStateService } from '../pedido-state.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    HlmCarouselComponent,
    HlmCarouselContentComponent,
    HlmCarouselItemComponent,
    HlmCarouselNextComponent,
    HlmCarouselPreviousComponent,
    NgFor,
  ],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  productIds: number[] = [];
  orderStatus: string | null = null;

  constructor(private pedidoStateService: PedidoStateService) {
    effect(() => {
      this.productIds = JSON.parse(localStorage.getItem('productIds') || '[]');
      console.log('Received product IDs in ProductsListComponent:', this.productIds);
    });

    // Efecto para sincronizar orderStatus
    effect(() => {
      this.orderStatus = localStorage.getItem('orderStatus');
      console.log('Received order status in ProductsListComponent:', this.orderStatus);
    });
  }

  ngOnInit(): void {
    // Efecto para sincronizar productIds
    
  }
}
