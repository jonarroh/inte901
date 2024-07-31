import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidoStateService } from '../pedido-state.service';

@Component({
  selector: 'app-process-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-state.component.html',
  styleUrl: './process-state.component.css'
})
export class ProcessStateComponent implements OnInit {

  status: string | null = null;

  constructor(private pedidoStateService: PedidoStateService) {}

  ngOnInit(): void {
    this.pedidoStateService.getOrderStatus().subscribe(status => {
      this.status = status;
    });
  }
}
