import { Component, inject, signal, TrackByFunction } from '@angular/core';
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
import { from, Observable, map, timer } from 'rxjs';
import { HlmTableModule } from '~/components/ui-table-helm/src';
import { VentasService } from './ventas.service';
import { Order } from './interface/order';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
import { HlmSelectModule } from '~/components/ui-select-helm/src';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { Address, CreditCard } from '~/lib/types';
import { ProductoService } from '../productos/service/producto.service';
import { DetailOrder } from './interface/detailorder';
import { ca, de } from 'date-fns/locale';
import { Ingrediente } from '../../../lib/types';
import { IngredienteService } from '../ingredientes/service/ingrediente.service';
import { HlmCheckboxComponent } from '~/components/ui-checkbox-helm/src';
import { HlmSheetComponent, HlmSheetContentComponent, HlmSheetDescriptionDirective, HlmSheetFooterComponent, HlmSheetHeaderComponent, HlmSheetTitleDirective } from '~/components/ui-sheet-helm/src';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '~/components/ui-sonner-helm/src';
import { Producto } from './interface/producto';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '~/components/ui-command-helm/src';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '~/components/ui-popover-helm/src';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/ui-alertdialog-brain';
import { HlmAlertDialogActionButtonDirective, HlmAlertDialogCancelButtonDirective, HlmAlertDialogComponent, HlmAlertDialogContentComponent, HlmAlertDialogDescriptionDirective, HlmAlertDialogFooterComponent, HlmAlertDialogHeaderComponent, HlmAlertDialogOverlayDirective, HlmAlertDialogTitleDirective } from '~/components/ui-alertdialog-helm/src';

type Framework = { label: string; value: string };

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
    HlmToasterComponent,
    BrnCommandImports,
    HlmCommandImports,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    NgForOf,
    HlmIconComponent,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,
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
  producto: Producto = {};
  total: number = 0;
  status: string = '';

  constructor() {
    this.orders$ = this.orderService.getOrders();
    this.detalles$ = this.orderService.getOrderDetail(0) as Observable<DetailOrder[]>;
    this.productos$ = this.productoService.getProductos() as Observable<Producto[]>;
    this.ingredientes$ = this.ingredientesService.getIngredientes() as Observable<Ingrediente[]>;
    this.cargarCarrito();
    this.calcularTotal();
  }

  trackByOrderId: TrackByFunction<Order> = (index, order) => order.id;

  cargarCarrito() {
    const storedCart = localStorage.getItem('carrito');
    if (storedCart) {
      this.carrito = JSON.parse(storedCart);
    }
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  onDetail(order: Order) {
    this.detalles = { ...order.detailOrders } as DetailOrder[];

    const detButton = document.getElementById('detail-show');
    detButton?.click();
  }

  getDetails(order: Order) {
    const id: number = order.id || 0;

    this.orderService.getOrderDetail(id).subscribe(
      (details) => {
        this.detalles = details;;

        this.detalles.forEach(detalle => {

        });

        const detButton = document.getElementById('detail-show');
        detButton?.click();
      },
      (error) => {

      }
    );
  }

  onGestion(order: Order) {
    const id: number = order.id || 0;
    const ticket: number = order.ticket || 0;

    this.orderService.getOrder(ticket, id).subscribe(
      (orderdata) => {
        this.orderService.getOrderDetail(id).subscribe(
          (details) => {
            orderdata.detailOrders = details;

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
    const existingItem = this.carrito.find(item => item.idProduct === producto.id);
    if (existingItem) {
      existingItem.quantity! += 1;
    } else {
      this.carrito.push({
        idProduct: producto.id,
        quantity: 1,
        product: {
          id: producto.id,
          nombre: producto.nombre,
          price: producto.precio
        },
        priceSingle: producto.precio,
        ingredients: 'Crema',
        status: 'Pendiente'
      });

      toast.success(
        `${producto.nombre} agregado al carrito`, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000
      }
      );
    }
    this.calcularTotal();
    this.guardarCarrito();
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
      if (detailMap.has(detalle.idProduct ?? 0)) {
        const existing = detailMap.get(detalle.idProduct ?? 0)!;
        existing.quantity = (existing.quantity ?? 0) + (detalle.quantity ?? 0);
      } else {
        detailMap.set(detalle.idProduct ?? 0, { ...detalle });
      }
      this.total += (detalle.priceSingle ?? 0) * (detalle.quantity ?? 0);
    });

    this.carrito = Array.from(detailMap.values());
    console.log('Detalles totales: ', this.carrito);
  }

  quitarItem(detalle: DetailOrder) {
    const index = this.carrito.findIndex(item => item.idProduct === detalle.idProduct);
    if (index !== -1) {
      if (this.carrito[index].quantity! > 1) {
        this.carrito[index].quantity!--;
      } else {
        this.carrito.splice(index, 1);
      }

      toast.success(
        `${detalle.product} eliminado del carrito`, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000
      });

      this.calcularTotal();
      this.guardarCarrito();
    }
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.priceSingle! * item.quantity!), 0);
  }

  enviarOrden() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('Usuario no autenticado.');
      return;
    }

    const credit: CreditCard = {
      id: 0,
      cardNumber: 'NA',
      cardHolderName: 'NA',
      estatus: 'NA',
      expiryDate: 'NA',
      userId: 0
    };

    const direccion: Address = {
      calle: 'NA',
      ciudad: 'NA',
      codigoPostal: 'NA',
      colonia: 'NA',
      estado: 'NA',
      estatus: 'Activo',
      id: 0,
      numeroExterior: 0,
      pais: 'NA',
      userId: 0
    }

    const nuevaOrden: Order = {
      idClient: 0,
      idUser: parseInt(userId, 10) ?? 0,
      total: this.total,
      isDelivery: false,
      detailOrders: this.carrito,
      creditCard: credit,
      direcciones: direccion
    };

    console.log(nuevaOrden);

    this.orderService.addOrder(nuevaOrden).subscribe(
      (order) => {
        console.log('Orden enviada: ', order);
        toast.success(
          'Se realizo la orden', {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },
          duration: 2000,
          onAutoClose: ((toast => {
            location.reload();
          }))
        }
        );

        this.carrito = [];
        this.total = 0;
        this.guardarCarrito();
      },
      (error) => {
        toast.error('Se produjo un error al realizar la orden');
        console.error('Error al enviar la orden: ', error);
      }
    );
  }

  updateStatus() {
    console.log('Orden a actualizar: ', this.status);
  }

  public frameworks = [
    {
      label: 'Cancelar',
      value: 'Cancelado',
    },
    {
      label: 'Entregado',
      value: 'Entregado',
    },
  ];
  public currentFramework = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
    if (state === 'closed') {
      const statusBtn = document.getElementById('edit-status');
      statusBtn?.click();
    }
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentFramework()?.value === framework.value) {
      this.currentFramework.set(undefined);
    } else {
      this.currentFramework.set(framework);
      this.status = framework.value;
    }
  }
}
