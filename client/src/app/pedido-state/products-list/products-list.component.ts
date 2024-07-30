import { Component, OnInit } from '@angular/core';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent } from '~/components/ui-carousel-helm/src';
import { PedidoStateService } from '../pedido-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [HlmCarouselComponent, HlmCarouselContentComponent, 
    HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent,
  CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit{

  productIds: number[] = [];

  constructor(private pedidoStateService: PedidoStateService) {}

  ngOnInit(): void {
    this.pedidoStateService.productIds$.subscribe(ids => {
      this.productIds = ids;
    });
  }

}
