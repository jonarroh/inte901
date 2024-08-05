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
import { Producto } from '~/lib/types';
import { ProductoService } from '../productos/service/producto.service';
import { DetailOrder } from './interface/detailorder';
import { ca, de } from 'date-fns/locale';
import { Ingrediente } from '../../../lib/types';
import { IngredienteService } from '../ingredientes/service/ingrediente.service';
import { HlmCheckboxComponent } from '~/components/ui-checkbox-helm/src';
import { HlmSheetComponent, HlmSheetContentComponent, HlmSheetDescriptionDirective, HlmSheetFooterComponent, HlmSheetHeaderComponent, HlmSheetTitleDirective } from '~/components/ui-sheet-helm/src';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';

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
    HlmCheckboxComponent,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  orderService = inject(VentasService);
  productoService = inject(ProductoService);
  ingredientesService = inject(IngredienteService);
  orders$: Observable<Order[]>;
  productos$: Observable<Producto[]>;
  ingredientes$: Observable<Ingrediente[]>;
  order: Order = {};
  detalles$: Observable<DetailOrder[]>;
  detalles: DetailOrder[] = [];
  ingredientes: Ingrediente[] = [];
  carrito: DetailOrder[] = [];
  total: number = 0;

  constructor() {
    this.orders$ = this.orderService.getOrders();
    this.detalles$ = this.orderService.getDetail(0) as Observable<DetailOrder[]>;
    this.productos$ = this.productoService.getProductos() as Observable<Producto[]>;
    this.ingredientes$ = this.ingredientesService.getIngredientes() as Observable<Ingrediente[]>;
  }

  trackByOrderId: TrackByFunction<Order> = (index, order) => order.id;

  onDetail(order: Order) {
    this.detalles = { ...order.details } as DetailOrder[];

    const detButton = document.getElementById('detail-show');
    detButton?.click();
  }

  getDetail(order: Order) {
    const id: number = order.id || 0;

    this.orderService.getDetail(id).subscribe(
      (details) => {
        this.detalles$ = this.orderService.getDetail(id) as Observable<DetailOrder[]>;

        this.detalles = [details];

        this.detalles.forEach((detail) => {
          console.log(detail);
          this.productoService.getProductoById(detail.idProduct || 0).subscribe(
            (producto) => {
              detail.pruduct = producto.nombre;
            }
          );
        });

        const detButton = document.getElementById('detail-show');
        detButton?.click();
        console.log('Detalles encontrados: ', this.detalles);
      }
    );
  }

  onGestion(order: Order) {
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

  addToCart(producto: Producto) {
    const detalle: DetailOrder = {
      idProduct: producto.id,
      quantity: 1,
      pruduct: producto.nombre,
      priceSingle: producto.precio,
    };

    this.detalles.push(detalle);
  }

  detalleTotal() {
    if (this.detalles.length === 0) {
      this.total = 0;
      this.carrito = [];
      return;
    }

    const detailMap = new Map<number, DetailOrder>();
    this.total = 0;

    this.detalles.forEach(detalle => {
      if (detailMap.has(detalle.idProduct??0)) {
        const existing = detailMap.get(detalle.idProduct??0)!;
        existing.quantity = (existing.quantity ?? 0) + (detalle.quantity ?? 0);
      } else {
        detailMap.set(detalle.idProduct??0, { ...detalle });
      }
      this.total += (detalle.priceSingle ?? 0) * (detalle.quantity ?? 0);
    });

    this.carrito = Array.from(detailMap.values());
    console.log('Detalles totales: ', this.carrito);
  }

  quitarItem(detalle: DetailOrder) {
    if (this.carrito.length === 0) return;

    const carritoIndex = this.carrito.findIndex(d => d.idProduct === detalle.idProduct);
    if (carritoIndex === -1) return;

    const item = this.carrito[carritoIndex];
    this.total -= (item.priceSingle ?? 0) * (item.quantity ?? 0);
    this.carrito.splice(carritoIndex, 1);

    // Solo eliminar del carrito si la cantidad llega a 0
    if (item.quantity && item.quantity > 1) {
      item.quantity -= 1;
      this.detalles.push(item); // Agregar de nuevo a detalles con la cantidad reducida
    } else {
      const detalleIndex = this.detalles.findIndex(d => d.idProduct === detalle.idProduct);
      if (detalleIndex !== -1) {
        this.detalles.splice(detalleIndex, 1); // Eliminar del array de detalles
      }
    }

    // Recalcular el total en caso de haber cambios
    this.detalleTotal();

    console.log('Carrito actualizado: ', this.carrito);
  }
}
