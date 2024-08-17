import { Component, TrackByFunction, computed, effect, inject, signal, ChangeDetectorRef } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';
import {
  HlmDialogComponent, HlmDialogContentComponent, HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '~/components/ui-dialog-helm/src';

import { FormsModule, NgForm } from '@angular/forms';
import { lucideArrowUpDown, lucideChevronDown, lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmButtonModule } from '~/components/ui-button-helm/src';
import { HlmCheckboxCheckIconComponent, HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective, HlmInputModule } from '~/components/ui-input-helm/src';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnDialogTriggerDirective, BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { from, debounceTime, map, Observable, switchMap, forkJoin } from 'rxjs';
import { ComprasService } from './compras.service';
import { Compra } from './interface/compras';
import { CommonModule, NgForOf } from '@angular/common';
import { Proveedor } from './interface/proveedor';
import { ProveedoresService } from '~/app/proveedores/proveedores.service';
import { HlmAccordionDirective, HlmAccordionModule } from '~/components/ui-accordion-helm/src';
import { BrnAccordionModule } from '@spartan-ng/ui-accordion-brain';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
import { DetailPurchase } from './interface/detailcompras';
import { HlmAlertDialogActionButtonDirective, HlmAlertDialogCancelButtonDirective, HlmAlertDialogComponent, HlmAlertDialogContentComponent, HlmAlertDialogDescriptionDirective, HlmAlertDialogFooterComponent, HlmAlertDialogHeaderComponent, HlmAlertDialogOverlayDirective, HlmAlertDialogTitleDirective } from '~/components/ui-alertdialog-helm/src';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/ui-alertdialog-brain';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '~/components/ui-popover-helm/src';
import { HlmCommandImports } from '~/components/ui-command-helm/src';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmToasterComponent } from '~/components/ui-sonner-helm/src';
import { HlmSheetComponent, HlmSheetContentComponent, HlmSheetDescriptionDirective, HlmSheetFooterComponent, HlmSheetHeaderComponent, HlmSheetTitleDirective } from '~/components/ui-sheet-helm/src';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import { MateriaPrimaProveedor } from '~/lib/types';
import { MppService } from './mpp.service';
import { toast } from 'ngx-sonner';
import { fr } from 'date-fns/locale';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SelectionModel } from '@angular/cdk/collections';

type Framework = { label: string; value: string };
type Presentations = { label: string; value: string };
type Materias = { label: string; value: string };
type Status = { label: string; value: string };

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    NavComponent,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonModule,
    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,
    HlmIconComponent,
    HlmInputDirective,
    HlmMenuModule,
    BrnMenuTriggerDirective,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmTableModule,
    BrnTableModule,
    HlmSelectModule,
    BrnSelectModule,
    FormsModule,
    CommonModule,
    HlmInputDirective,
    HlmAccordionDirective,
    HlmAccordionModule,
    BrnAccordionModule,
    HlmToasterComponent,
    BrnCommandImports,
    HlmCommandImports,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
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
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css',
  providers: [
    provideIcons({ lucideArrowUpDown, lucideChevronDown, lucideMoreHorizontal }),
  ],
})
export class ComprasComponent {
  compraServe = inject(ComprasService);
  proveedorServe = inject(ProveedoresService);
  materiaprimaServe = inject(MateriasPrimasService);
  mppServe = inject(MppService);
  compras$: Observable<Compra[]>;
  proveedores$: Observable<Proveedor[]>;
  detalles$: Observable<DetailPurchase[]>;
  detalles: DetailPurchase[] = [];
  mp$: Observable<MateriaPrima[]>;
  mpp$: Observable<MateriaPrimaProveedor[]>;
  proveedores: Proveedor[] = [];
  public frameworks: Framework[] = [];
  public currentFramework = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');
  public currentPresentation = signal<Presentations | undefined>(undefined);
  public statePresentation = signal<'closed' | 'open'>('closed');
  public presentations: Presentations[] = [
    { label: 'Costal 50kg', value: 'Costal 50kg' },
    { label: 'Caja 350gr', value: 'Caja 350gr' },
    { label: 'Cartón 1lt', value: 'Carton 1lt' },
    { label: 'Botella 1lt', value: 'Botella 1lt' },
    { label: 'Docena 70gr', value: 'Docena 70gr' },
    { label: 'Bolsa 1kg', value: 'Bolsa 1kg' },
    { label: 'Galón 20lt', value: 'Galon 20lt' },
    { label: 'Pieza', value: 'Pieza' },
    { label: 'Empacado 400gr', value: 'Empacado 400gr' },
    { label: 'Empacado 1kg', value: 'Empacado 1kg' },
    { label: 'Empacado 200gr', value: 'Empacado 200gr' },
    { label: 'Caja 1kg', value: 'Caja 1kg' },
    { label: 'Frasco 400gr', value: 'Frasco 400gr' },
    { label: 'Barra 100gr', value: 'Barra 100gr' },
    { label: 'Costal 25kg', value: 'Costal 25kg' },
    { label: 'Galón 10lt', value: 'Galon 10lt' },
    { label: 'Botella 500ml', value: 'Botella 500ml' },
    { label: 'Caja 2kg', value: 'Caja 2kg' },
    { label: 'Lata 250gr', value: 'Lata 250gr' },
    { label: 'Bolsa 500gr', value: 'Bolsa 500gr' },
    { label: 'Cartón 500ml', value: 'Carton 500ml' },
    { label: 'Sobre 50gr', value: 'Sobre 50gr' },
    { label: 'Lata 1kg', value: 'Lata 1kg' },
    { label: 'Botella 750ml', value: 'Botella 750ml' },
    { label: 'Caja 5kg', value: 'Caja 5kg' },
  ];
  public presentationsFiltered: Presentations[] = [];
  typePresentation: string = '';
  public materias: Materias[] = [];
  public currentMateria = signal<Materias | undefined>(undefined);
  public stateMateria = signal<'closed' | 'open'>('closed');

  carrito: DetailPurchase[] = [];
  total: number = 0;

  public mppFiltradas: MateriaPrimaProveedor[] = [];
  public mppF: MateriaPrima[] = [];

  public idCompra: number = 0;
  public idDetalle: number = 0;
  idcomprastatus: number = 0;
  public status: string = '';
  public statusDetalle: string = '';
  public popoverStates: { [key: number]: 'closed' | 'open' } = {};
  public currentStatus: { [key: number]: Status | undefined } = {};
  public statusComp: Status[] = [
    { label: 'Cancelar', value: 'Cancelada' },
    { label: 'Entregada', value: 'Entregada' },
  ];

  constructor(private cdr: ChangeDetectorRef) {
    this.compras$ = this.compraServe.getCompras();
    this.proveedores$ = this.proveedorServe.getProveedores();
    this.mp$ = this.materiaprimaServe.getMateriaPrima();
    this.mpp$ = this.mppServe.getMPP();
    this.detalles$ = this.compraServe.getDetailCompra(0) as Observable<DetailPurchase[]>;
    this.cargarCarrito();
    this.calcularTotal();

    this.proveedores$.subscribe(proveedores => {
      proveedores.forEach(proveedor => {
        var value = proveedor.nombreEmpresa + '-' + proveedor.id?.toString();
        return this.frameworks.push({ label: proveedor.nombreEmpresa || '', value: value || '' });
      });
    });

    this.mp$.subscribe(materias => {
      materias.forEach(materia => {
        var value = materia.material + '-' + materia.id?.toString();
        return this.materias.push({ label: materia.material || '', value: value || '' });
      });
    });

    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });

    this.compras$.subscribe({
      next: (compras) => {
        this._compras.set(compras);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // recibe la informacion del formulario
  proveedorId: number = 0;
  materiaPrimaId: number = 0;
  cantidad: number = 0;
  precio: number = 0;
  presentacion: string = '';
  unitType: string = '';

  trackByCompraId: TrackByFunction<Compra> = (index, compra) => compra.id;

  public cantidades: { [id: number]: number | null } = {};

  cargarCarrito() {
    const storedCart = localStorage.getItem('carrito');
    if (storedCart) {
      this.carrito = JSON.parse(storedCart);
    }
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.priceSingle! * item.quantity!), 0);
  }

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentFramework()?.value === framework.value) {
      this.currentFramework.set(undefined);
    } else {
      this.filtrarMppPorProveedor(framework.value ? this.getProveedorIdFromValue(framework.value) || 0 : 0);
      this.currentFramework.set(framework);
      this.proveedorId = this.getProveedorIdFromValue(framework.value) || 0;
    }
  }

  filtrarMppPorProveedor(idProveedor: number) {
    this.mppServe.getMPP().subscribe(mpp => {
      this.mppFiltradas = mpp.filter(mp => mp.proveedorId === idProveedor);
      let mppConNombres: MateriaPrima[] = [];
      this.mppFiltradas.forEach(mp => {
        this.materiaprimaServe.getMateriaPrima().subscribe(materiaPrima => {
          const materiaPrimaEncontrada = materiaPrima.find(mp2 => mp2.id === mp.materiaPrimaId);
          if (materiaPrimaEncontrada) {
            mppConNombres.push(materiaPrimaEncontrada);
          }
          if (mppConNombres.length === this.mppFiltradas.length) {
            this.mppF = mppConNombres;
            this.cdr.detectChanges();
          }
        });
      });
    });
  }

  stateChangedMateria(state: 'open' | 'closed') {
    this.stateMateria.set(state);
  }

  commandMateriaSelected(mpp: MateriaPrima) {
    this.stateMateria.set('closed');
    if (this.currentMateria()?.value === mpp.material) {
      this.currentMateria.set(undefined);
    } else {
      var value = mpp.material + '-' + mpp.id?.toString();
      this.materiaPrimaId = mpp.id || 0;
      this.currentMateria.set({ label: mpp.material || '', value: value || '' });

      var tipo = this.compraServe.getInventarioType(mpp.id || 0).subscribe((inventario) => {
        if (inventario.unidadMedida) {
          this.typePresentation = inventario.unidadMedida;
        }
      });
    }
  }

  getFilterPresent() {
    console.log(this.typePresentation);
    return this.presentations.filter(presentation =>
      presentation.value.toLowerCase().includes(this.typePresentation.toLowerCase())
    );
  }

  stateChangedPresentation(state: 'open' | 'closed') {
    this.statePresentation.set(state);
    this.presentations = this.getFilterPresent();
  }

  commandPresentationSelected(presentation: Presentations) {
    this.statePresentation.set('closed');
    if (this.currentPresentation()?.value === presentation.value) {
      this.currentPresentation.set(undefined);
    } else {
      this.currentPresentation.set(presentation);
      this.presentacion = presentation.value;
      this.unitType = this.getUnitTypeFromValue(presentation.value) || '';
    }
  }

  getProveedorIdFromValue(value: string): number | undefined {
    const parts = value.split('-');
    const id = parts[1] ? parseInt(parts[1], 10) : undefined;
    return isNaN(id || 0) ? undefined : id;
  }

  getMateriaPrimaIdFromValue(value: string): number | undefined {
    const parts = value.split('-');
    const id = parts[1] ? parseInt(parts[1], 10) : undefined;
    return isNaN(id || 0) ? undefined : id;
  }

  getUnitTypeFromValue(value: string): string | undefined {
    const parts = value.split('-');

    // extrae los ultimos 2 caracteres de la cadena para obtener el tipo de unidad
    const unitType = parts[0].slice(-2);
    return unitType;
  }

  onSubmit() {
    console.log(this.proveedorId, this.materiaPrimaId, this.cantidad, this.precio, this.presentacion);

    const existingItem = this.carrito.find(item => item.idMP === this.materiaPrimaId);
    const cantidad = this.cantidades[this.materiaPrimaId] || 0;

    if (existingItem) {
      existingItem.quantity! += this.cantidad;
    } else {
      this.carrito.push({
        idMP: this.materiaPrimaId,
        priceSingle: this.precio,
        quantity: this.cantidad,
        presentation: this.presentacion,
        unitType: this.unitType,
        idProveedor: this.proveedorId,
        status: 'Pendiente',
      });

      toast.success('Producto agregado al carrito', {
        duration: 1200,
        onAutoClose: ((toast => {
          location.reload();
        })),
      });
    }

    this.guardarCarrito();
    this.calcularTotal();

    this.cantidades[this.materiaPrimaId || 0] = null;
    this.cantidad = 0;
    this.resetCombo();
  }

  quitarItem(detalle: DetailPurchase) {
    const index = this.carrito.findIndex(item => item.idMP === detalle.idMP);

    if (index !== -1) {
      if (this.carrito[index].quantity! > 1) {
        this.carrito[index].quantity!--;
      } else {
        this.carrito.splice(index, 1);
      }

      toast.success(
        `Eliminado del carrito`, {
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

  resetCombo() {
    if (this.currentFramework()) {
      this.currentFramework.set(undefined);
    }

    if (this.currentPresentation()) {
      this.currentPresentation.set(undefined);
    }

    if (this.currentMateria()) {
      this.currentMateria.set(undefined);
    }

    this.proveedorId = 0;
    this.materiaPrimaId = 0;
    this.precio = 0;
    this.unitType = '';
  }

  sendCompra() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.error('No se ha iniciado sesión', {
        duration: 2000,
        onAutoClose: ((toast) => {
          return;
        }
        )
      });
    }

    const ncompra: Compra = {
      total: this.total,
      idUser: parseInt(userId || '', 10) ?? 0,
      status: 'Pendiente',
      details: this.carrito,
    };

    this.compraServe.addCompra(ncompra).subscribe((compra) => {
      toast.success('Compra realizada con éxito', {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000,
        onAutoClose: ((toast) => {
          location.reload();
        }),
      });

      this.carrito = [];
      this.total = 0;
      this.guardarCarrito();
    }, (error) => {
      console.error(error);
      toast.error('Error al realizar la compra', {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000,
      });
    });
  }

  stateChangedStatus(state: 'open' | 'closed', id: number) {
    this.popoverStates[id] = state;
    if (state === 'closed') {
      const statusBtn = document.getElementById('statuscompra');
      statusBtn?.click();
    }
  }

  commandStatusSelected(status: Status, id: number) {
    this.popoverStates[id] = 'closed';

    if (this.currentStatus[id]?.value === status.value) {
      this.currentStatus[id] = undefined;
    } else {
      this.currentStatus[id] = status;
      this.idCompra = id;
      this.status = status.value;
    }
  }

  currentStatusCompras(id: number): Status | undefined {
    return this.currentStatus[id];
  }

  updateStatus() {
    console.log(this.idCompra, this.status);
    this.compraServe.updateCompraStatus(this.idCompra, this.status).subscribe((compra) => {
      console.log(compra);
      toast.success('Estado actualizado con éxito', {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000,
        onAutoClose: ((toast) => {
          // location.reload();
        }),
      });
    }, (error) => {
      toast.error('Error al actualizar el estado', {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000,
      });
    });
  }

  cancelarMaterial(id: number) {
    const statusBtn = document.getElementById('edit-status-detalle');
    statusBtn?.click();

    this.idDetalle = id;
    this.statusDetalle = 'Cancelada';
  }

  updateStatusDetalle() {
    this.compraServe.updateDetalleStatus(this.idDetalle, this.statusDetalle).subscribe((compra) => {
      toast.success('Estado actualizado con éxito', {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000,
        onAutoClose: ((toast) => {
          location.reload();
        }),
      });
    }, (error) => {
      toast.error('Error al actualizar el estado', {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
        duration: 2000,
      });
    });
  }

  closeAlert() {
    if (this.idCompra !== undefined) {
      this.currentStatus[this.idCompra] = undefined;
    }
  }

  getDetails(compra: Compra) {
    const id: number = compra.id || 0;

    this.compraServe.getDetailCompra(id).subscribe((compra) => {
      this.detalles = compra;

      this.detalles.forEach(detalle => {
        // Formatea la fecha de expiración a YYYY-MM-DD
        if (detalle.expiration) {
          const fecha = new Date(detalle.expiration);
          // Formatea la fecha de expiración a YYYY-MM-DD
          const fechaFormat = fecha.toISOString().slice(0, 10);
          detalle.expiration = fechaFormat;
        }

        // Obtiene el nombre de la materia prima
        this.materiaprimaServe.getMateriaPrimaById(detalle.idMP || 0).subscribe((materia) => {
          detalle.materiaPrima = materia.material;
        });
      });
    });

    const detBtn = document.getElementById('edit-status-detalle');
    detBtn?.click();
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Compra>(true);
  protected readonly _isCompraSelected = (compr: Compra) => this._selectionModel.isSelected(compr);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(() => this._selectionModel.selected)),{
      initialValue: []
    }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    CreatedAt: { visible: true, label: 'Fecha' },
    Total: { visible: true, label: 'Total' },
    Detalles: { visible: true, label: 'Detalles' },
    Status: { visible: true, label: 'Status' },
    Acciones: { visible: true, label: 'Acciones' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
  ]);

  private readonly _compras = signal<Compra[]>([]);
  private readonly _filteredCompras = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._compras().filter((u) => u.status?.toLowerCase().includes(emailFilter));
    }
    return this._compras();
  });
  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredCompras();
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

  protected readonly _trackBy: TrackByFunction<Compra> = (_: number, p: Compra) => p.id;
  protected readonly _totalElements = computed(() => this._filteredCompras().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });


  protected togglePayment(payment: Compra) {
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
