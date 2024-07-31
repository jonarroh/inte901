import { Component, inject, TrackByFunction } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';
import {
  HlmDialogComponent, HlmDialogContentComponent, HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '~/components/ui-dialog-helm/src';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { BrnDialogTriggerDirective, BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { from, Observable } from 'rxjs';
import { HlmTableModule } from '~/components/ui-table-helm/src';
import { VentasService } from './ventas.service';
import { Order } from './interface/order';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmSelectModule } from '~/components/ui-select-helm/src';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    NavComponent,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmInputDirective,
    HlmTableModule,
    FormsModule,
    CommonModule,
    HlmSelectModule,
    BrnSelectModule,
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  orderService = inject(VentasService);
  orders$: Observable<Order[]>;
  order: Order = {};

  constructor () {
    this.orders$ = this.orderService.getOrders();
  }

  trackByOrderId: TrackByFunction<Order> = (index, order) => order.id;

  onDetail(order: Order){
    this.order = {...order};

    const detButton = document.getElementById('detail-show');
    detButton?.click();
  }

  onGestion(order: Order){
    this.order = {...order};

    const detButton = document.getElementById('edit-status');
    detButton?.click();
  }
}
