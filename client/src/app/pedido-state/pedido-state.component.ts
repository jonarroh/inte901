import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent } from '~/components/ui-carousel-helm/src';

@Component({
  selector: 'app-pedido-state',
  standalone: true,
  imports: [
    NavbarComponent, HlmCarouselComponent, HlmCarouselContentComponent, 
    HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent
  ],
  templateUrl: './pedido-state.component.html',
  styleUrl: './pedido-state.component.css'
})
export class PedidoStateComponent {

}
