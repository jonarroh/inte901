import { Component, OnInit } from '@angular/core';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent } from '~/components/ui-carousel-helm/src';
import { PedidoStateService } from '../pedido-state.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent, NgFor],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  productIds: number[] = [];
  orderStatus: string | null = null;

  constructor(private pedidoStateService: PedidoStateService) {}

  ngOnInit(): void {
    this.pedidoStateService.productIds$.subscribe(ids => {
      console.log('Received product IDs in ProductsListComponent:', ids);
      this.productIds = ids;
    });

    this.pedidoStateService.orderStatus$.subscribe(status => {
      console.log('Received order status in ProductsListComponent:', status);
      this.orderStatus = status;
    });
  }
}