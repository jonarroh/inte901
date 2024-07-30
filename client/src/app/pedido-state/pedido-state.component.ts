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

  orderId: number | null = null;

  constructor(private route:ActivatedRoute, private pedidoStateService : PedidoStateService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = +params.get('id')!;
      // Lógica para obtener los productos de la orden y enviar los IDs
      // Ejemplo de IDs:
      const productIds = this.getProductIdsFromOrder(orderId);
      this.pedidoStateService.setProductIds(productIds);
    });
  }

  getProductIdsFromOrder(orderId: number): number[] {
    // Lógica para obtener los IDs de productos basados en el orderId
    // Esto es solo un ejemplo y debes reemplazarlo con la lógica real
    return [1, 2, 3, 4]; // Reemplaza con la lista real de IDs
  }

}
