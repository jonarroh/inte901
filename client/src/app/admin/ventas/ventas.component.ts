import { Component, computed, effect, inject, input, signal, TrackByFunction } from '@angular/core';
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
import { from, Observable, map, timer, debounceTime } from 'rxjs';
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
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SelectionModel } from '@angular/cdk/collections';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '~/components/ui-menu-helm/src';
import { HlmBadgeDirective } from '~/components/ui-badge-helm/src';
import { LucideAngularModule } from 'lucide-angular';

type Framework = { label: string; value: string };
type Status = { label: string; value: string };

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    // BrnCommandImports,
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
    BrnTableModule,
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
    BrnMenuTriggerDirective,
    HlmMenuModule,
    HlmBadgeDirective,
    LucideAngularModule
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  userId = 0;
  userData = '';
  rol = '';

  orderService = inject(VentasService);
  productoService = inject(ProductoService);
  ingredientesService = inject(IngredienteService);
  orders$: Observable<Order[]>;
  ordersDelivery$: Observable<Order[]>;
  productos$: Observable<Producto[]>;
  ingredientes$: Observable<Ingrediente[]>;
  order: Order = {};
  detalles$: Observable<DetailOrder[]>;
  detalles: DetailOrder[] = [];
  ingredientes: Ingrediente[] = [];
  carrito: DetailOrder[] = [];
  producto: Producto = {};
  total: number = 0;
  public idOrden: number = 0;
  public idDetalle: number = 0;
  public status: string = '';
  public statusProducto: string = '';
  public popoverStates: { [key: number]: 'closed' | 'open' } = {};
  public currentFrameworks: { [key: number]: Framework | undefined } = {};
  public frameworks: Framework[] = [];

  constructor() {
    this.orders$ = this.orderService.getOrders();
    this.ordersDelivery$ = this.orderService.getOrdersNotDelivered();
    this.detalles$ = this.orderService.getOrderDetail(0) as Observable<DetailOrder[]>;
    this.productos$ = this.productoService.getProductos() as Observable<Producto[]>;
    this.ingredientes$ = this.ingredientesService.getIngredientes() as Observable<Ingrediente[]>;
    this.cargarCarrito();
    this.calcularTotal();
    this.idOrden = 0;
    this.status = '';

    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });

    this.orders$.subscribe({
      next: (orders) => {
        this._orders.set(orders);
      },
      error: (error) => {
        console.error('Error al consultar las ordenes: ', error);
      }
    });

    this.ordersDelivery$.subscribe({
      next: (orders) => {
        this._ordersND.set(orders);
      },
      error: (error) => {
        console.error('Error al consultar las ordenes: ', error);
      }
    });

    this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.userData = localStorage.getItem('userData') ?? '';
    this.rol = JSON.parse(this.userData).role;

    if (this.rol === 'Caja') {
      this.frameworks = [
        { label: 'Cancelar', value: 'Cancelado' },
        { label: 'Recibido', value: 'Recibido' },
      ];
    } else if (this.rol === 'Produccion') {
      this.frameworks = [
        { label: 'Cancelar', value: 'Cancelado' },
        { label: 'Aceptado', value: 'Aceptado' },
      ];
    } else if (this.rol === 'Repartidor') {
      this.frameworks = [
        { label: 'Recibido', value: 'Recibido' },
      ];
    } else {
      this.frameworks = [
        { label: 'Cancelar', value: 'Cancelado' },
        { label: 'Recibido', value: 'Recibido' },
        { label: 'Aceptado', value: 'Aceptado' },
      ];
    }

    console.log(this.frameworks);
  }

  trackByOrderId: TrackByFunction<Order> = (index, order) => order.id;

  fallbackUrl = 'http://localhost:5000/static/productos/fallback.webp';
  imageUrl = computed(() => `http://localhost:5000/static/productos/${this.id()}.webp`);
  idorderstatus: number = 0;
  id = input.required<number>();
  public cantidades: { [id: number]: number | null } = {};

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackUrl;
  }

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
        this.detalles = details;

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
    const cantidad = this.cantidades[producto.id || 0] || 1;
    if (existingItem) {
      existingItem.quantity! += 1;
    } else {
      this.carrito.push({
        idProduct: producto.id,
        quantity: cantidad,
        product: {
          id: producto.id,
          nombre: producto.nombre,
          price: producto.precio
        },
        priceSingle: producto.precio,
        ingredients: 'Crema',
        status: 'Ordenado'
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

    this.cantidades[producto.id || 0] = null;
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
      toast.error('Usuario no autenticado.', {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000
      });
      return;
    }

    const credit: CreditCard = {
      id: 0,
      cardNumber: 'NA',
      cardHolderName: 'NA',
      estatus: 'NA',
      expiryDate: 'NA',
      userId: 0,
      cvv: 'NA'
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
      creditCard: null,
      direcciones: null
    };

    console.log(nuevaOrden);

    this.orderService.addOrder(nuevaOrden).subscribe(
      (order) => {
        console.log('Orden enviada: ', order);
        toast.success(
          'Se realizó la orden', {
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
        // console.error('Error al enviar la orden: ', error);
      }
    );
  }

  updateStatus() {
    console.log('Orden a actualizar: ', this.status);

    this.orderService.updateOrderStatus(this.idOrden, this.status).subscribe(
      (order) => {
        console.log('Orden actualizada: ', order);
        toast.success(
          'Se actualizó el estatus de la orden', {
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
      },
      (error) => {
        toast.error('Se produjo un error al actualizar la orden');
        console.error('Error al actualizar la orden: ', error);
      }
    );
  }

  stateChanged(state: 'open' | 'closed', orderId: number) {
    this.popoverStates[orderId] = state;
    if (state === 'closed') {
      const statusBtn = document.getElementById('edit-status');
      statusBtn?.click();
    }
  }

  commandSelected(framework: Framework, orderId: number) {
    this.popoverStates[orderId] = 'closed'; // Cerrar el popover después de seleccionar

    if (this.currentFrameworks[orderId]?.value === framework.value) {
      this.currentFrameworks[orderId] = undefined;
    } else {
      this.currentFrameworks[orderId] = framework;
      this.idOrden = orderId;
      this.status = framework.value;
      console.log('Orden a actualizar: ', framework.value);
      console.log('ID de la orden: ', orderId);
    }
  }
  currentFramework(orderId: number): Framework | undefined {
    return this.currentFrameworks[orderId];
  }

  resetCombo() {
    // Reestablece el framework seleccionado para la orden actual
    if (this.idOrden !== undefined) {
      this.currentFrameworks[this.idOrden] = undefined;
    }

    // O si deseas reestablecer todos los comboboxes:
    // this.currentFrameworks = {};

    console.log('ComboBox reestablecido.');
    location.reload();
  }

  cancelarProducto(id: number) {
    console.log('Producto a cancelar: ', id);

    const statusBtn = document.getElementById('edit-status-producto');
    statusBtn?.click();

    this.idDetalle = id;
    this.statusProducto = 'Cancelado';
  }

  updateStatusProducto() {
    console.log('Producto a actualizar: ', this.statusProducto, 'con ID: ', this.idDetalle);

    this.orderService.updateDetailOrderStatus(this.idDetalle, this.statusProducto).subscribe(
      (order) => {
        console.log('Producto actualizado: ', order);
        toast.success(
          'Se actualizó el estatus del producto', {
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
      },
      (error) => {
        toast.error('Se produjo un error al actualizar el producto');
        console.error('Error al actualizar el producto: ', error);
      }
    );
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Order>(true);
  protected readonly _isOrderSelected = (ord: Order) => this._selectionModel.isSelected(ord);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(() => this._selectionModel.selected)), {
    initialValue: []
  }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    OrderDate: { visible: true, label: 'Fecha' },
    Total: { visible: true, label: 'Total' },
    Detalles: { visible: true, label: 'Detalles' },
    Status: { visible: true, label: 'Status' },
    TipoEntrega: { visible: true, label: 'Tipo de entrega' },
    Acciones: { visible: true, label: 'Acciones' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
  ]);

  private readonly _orders = signal<Order[]>([]);
  private readonly _ordersND = signal<Order[]>([]);
  private readonly _filteredOrders = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (this.rol === 'Caja') {
      if (emailFilter && emailFilter.length > 0) {
        return this._ordersND().filter((u) => u.status?.toLowerCase().includes(emailFilter));
      }
      return this._ordersND();
    }

    if (emailFilter && emailFilter.length > 0) {
      return this._orders().filter((u) => u.status?.toLowerCase().includes(emailFilter));
    }
    return this._orders();
  });

  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredOrders();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * (p1.status && p2.status ? p1.status.localeCompare(p2.status) : 0))
      .slice(start, end);
  });
  protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
    this._filteredSortedPaginatedPayments().every((payment) => this._selected().includes(payment)),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Order> = (_: number, p: Order) => p.id;
  protected readonly _totalElements = computed(() => this._filteredOrders().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });


  protected togglePayment(payment: Order) {
    this._selectionModel.toggle(payment);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedPayments());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
    }
  }

  protected handleEmailSortChange() {
    const sort = this._emailSort();
    if (sort === 'ASC') {
      this._emailSort.set('DESC');
    } else if (sort === 'DESC') {
      this._emailSort.set(null);
    } else {
      this._emailSort.set('ASC');
    }
  }
}
