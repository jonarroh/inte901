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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productIdsParam = params['productIds'];
      this.productIds = productIdsParam ? productIdsParam.split(',').map((id: string) => parseInt(id, 10)) : [];
      
      this.orderStatus = params['status'];
      
      console.log('Received product IDs:', this.productIds);
      console.log('Received order status:', this.orderStatus);
    });
  }
}