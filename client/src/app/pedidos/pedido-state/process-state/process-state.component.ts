import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { PedidoStateService } from '../pedido-state.service';

@Component({
  selector: 'app-process-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-state.component.html',
  styleUrls: ['./process-state.component.css']
})
export class ProcessStateComponent implements OnInit {
  status: string | null = null;

  constructor(private pedidoStateService: PedidoStateService) {
    effect(() => {
      this.status = localStorage.getItem('orderStatus');
      console.log('Received order status in ProcessStateComponent:', this.status);
    });
  }

  ngOnInit(): void {
    // Efecto para reaccionar a los cambios en la señal `orderStatus`
    
  }
}
