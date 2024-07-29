import { Component } from '@angular/core';


import { HlmCarouselComponent, HlmCarouselContentComponent,HlmCarouselItemComponent,HlmCarouselNextComponent,HlmCarouselPreviousComponent } from '@spartan-ng/ui-carousel-helm';
import { SignalRService } from '../orden/signal-rorder.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    HlmCarouselComponent, HlmCarouselContentComponent,HlmCarouselItemComponent,HlmCarouselNextComponent,HlmCarouselPreviousComponent 
  ],
  providers: [SignalRService],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  updates: string[] = [];

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.hubConnection.on('ReceiveOrderUpdate', (message: string) => {
      this.updates.push(message);
      const changeId = message.split(':')[0];
      const status = message.split(':')[1];

      //en esta partes vas a poder manejar el mensaje recibido
      //por ejemplo, tienes que ver si el changeId es igual a un id de orden que tengas cargada en tu componente
      //y si lo es, actualizas el estado de la orden con el status recibido
      

    });
  }
}
