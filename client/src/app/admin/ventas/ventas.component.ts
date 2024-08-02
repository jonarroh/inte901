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
import { DetailOrder } from './interface/detailorder';

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
  detalles$: Observable<DetailOrder[]>;
  detalles: DetailOrder[] = [];

  constructor () {
    this.orders$ = this.orderService.getOrders();
    this.detalles$ = this.orderService.getDetail(0) as Observable<DetailOrder[]>;
  }

  trackByOrderId: TrackByFunction<Order> = (index, order) => order.id;

  onDetail(order: Order){
    const id: number = order.id || 0;

    this.orderService.getDetail(id).subscribe(
      (order) => {
        this.detalles$ = this.orderService.getDetail(id) as Observable<DetailOrder[]>;

        this.detalles = [order];
        console.log(order);
        this.detalles.forEach(detail => {

        });
      }
    )
    this.order = {...order};

    const detButton = document.getElementById('detail-show');
    detButton?.click();
  }

  onGestion(order: Order){
    const id: number = order.id || 0;
    const ticket: number = order.ticket || 0;

    this.orderService.getOrder(ticket, id).subscribe(
      (orderdata) => {
        this.orderService.getDetail(id).subscribe(
          (details) => {
            orderdata.details = [details];

            this.order = orderdata;
          }
        );
        console.log('Orden encontrada: ', orderdata);
      },
      (error) => {
        console.error('Error al consultar la compra: ', error);
      }
    );

    const detButton = document.getElementById('edit-status');
    detButton?.click();
  }
}
