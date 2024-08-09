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
import { from, debounceTime, map, Observable } from 'rxjs';
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

type Framework = { label: string | '', value: string | '' };
type Presentations = { label: string | '', value: string | '' };
type MPP = { label: string | '', value: string | '' };

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
  mppServe = inject(MppService);
  mpServe = inject(MateriasPrimasService);
  compras$: Observable<Compra[]>;
  proveedores$: Observable<Proveedor[]>;
  proveedores: Proveedor[] = [];
  mp$: Observable<MateriaPrima[]>;
  mpp$: Observable<MateriaPrimaProveedor[]>;
  public frameworks: Framework[] = [];
  public currentFramework = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');
  public currentPresentation = signal<Presentations | undefined>(undefined);
  public statePresentation = signal<'closed' | 'open'>('closed');
  public presentations: Presentations[] = [
    { label: 'Costal 50kg', value: 'Costal 50kg' },
    { label: 'Caja 350gr', value: 'Caja 350gr' },
    { label: 'Carton 1lt', value: 'Carton 1lt' },
    { label: 'Botella 1lt', value: 'Botella 1lt' },
    { label: 'Docena 70gr', value: 'Docena 70gr' },
    { label: 'Bolsa 1kg', value: 'Bolsa 1kg' },
    { label: 'Galon 20lt', value: 'Galon 20lt' },
    { label: 'Pieza', value: 'Pieza' },
    { label: 'Empacado 400gr', value: 'Empacado 400gr' },
    { label: 'Empacado 1kg', value: 'Empacado 1kg' },
    { label: 'Empacado 200gr', value: 'Empacado 200gr' },
    { label: 'Caja 1kg', value: 'Caja 1kg' },
    { label: 'Frasco 400gr', value: 'Frasco 400gr' },
    { label: 'Barra 100gr', value: 'Barra 100gr' },
    { label: 'Costal 25kg', value: 'Costal 25kg' },
    { label: 'Galon 10lt', value: 'Galon 10lt' },
    { label: 'Botella 500ml', value: 'Botella 500ml' },
    { label: 'Caja 2kg', value: 'Caja 2kg' },
    { label: 'Lata 250gr', value: 'Lata 250gr' },
    { label: 'Bolsa 500gr', value: 'Bolsa 500gr' },
    { label: 'Carton 500ml', value: 'Carton 500ml' },
    { label: 'Sobre 50gr', value: 'Sobre 50gr' },
    { label: 'Lata 1kg', value: 'Lata 1kg' },
    { label: 'Botella 750ml', value: 'Botella 750ml' },
    { label: 'Caja 5kg', value: 'Caja 5kg' },
  ];
  public mppFiltradas: MateriaPrimaProveedor[] = [];
  public mppF: MateriaPrima[] = [];
  public stateMpp = signal<'closed' | 'open'>('closed');
  public currentMpp = signal<MPP | undefined>(undefined);
  public isProveedorDisabled = signal<boolean>(false);
  public cantidades: { [id: number]: number | null } = {};

  carrito: DetailPurchase[] = [];
  total: number = 0;

  public selectedProveedor: string = '';
  public cantidad: number | null = null;
  public precioUnitario: number | null = null;
  public presentacion: string = '';
  public selectedInsumo: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    this.compras$ = this.compraServe.getCompras();
    this.proveedores$ = this.proveedorServe.getProveedores();
    this.mp$ = this.mpServe.getMateriaPrima();
    this.mpp$ = this.mppServe.getMPP();
    this.cargarCarrito();
    this.calcularTotal();

    this.proveedores$.subscribe(proveedores => {
      proveedores.forEach(proveedor => {
        var value = proveedor.nombreEmpresa + '-' + proveedor.id?.toString();
        return this.frameworks.push({ label: proveedor.nombreEmpresa || '', value: value || '' });
      });
    });
  }

  trackByCompraId: TrackByFunction<Compra> = (index, compra) => compra.id;

  cargarCarrito() {
    const storedCart = localStorage.getItem('carrito');
    if (storedCart) {
      this.carrito = JSON.parse(storedCart);
    }
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  addToCart(form: NgForm) {
    if (form.valid) {
      this.carrito.push({
        quantity: this.cantidad || 0,
        priceSingle: this.precioUnitario || 0,
        presentation: this.presentacion,
        unitType: 'kg',
        status: 'Pendiente',
        purchase: {
          idProveedor: this.getProveedorIdFromValue(this.selectedProveedor) || 0,
        },
        materiaPrimaProveedor: {
          materiaPrimaId: parseInt(this.selectedInsumo.split('-')[1], 10),
          proveedorId: this.getProveedorIdFromValue(this.selectedProveedor) || 0,
        },
      });

      // Guarda el carrito y calcula el total
      this.guardarCarrito();
      this.calcularTotal();
      form.resetForm();
    } 
  }


  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.priceSingle! * item.quantity!), 0);
  }

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  statePresentationChanged(state: 'open' | 'closed') {
    this.statePresentation.set(state);
  }

  stateMppChanged(state: 'open' | 'closed') {
    this.stateMpp.set(state);
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentFramework()?.value === framework.value) {
      this.currentFramework.set(undefined);
      this.isProveedorDisabled.set(false);
    } else {
      this.currentFramework.set(framework);
      this.filtrarMppPorProveedor(framework.value ? this.getProveedorIdFromValue(framework.value) || 0 : 0);
      this.isProveedorDisabled.set(true);
    }
  }

  commandPresentationSelected(presentation: Presentations) {
    this.statePresentation.set('closed');
    if (this.currentPresentation()?.value === presentation.value) {
      this.currentPresentation.set(undefined);
    } else {
      this.currentPresentation.set(presentation);
    }
  }

  commandMppSelected(mpp: MateriaPrima) {
    this.stateMpp.set('closed');
    if (this.currentMpp()?.value === mpp.material) {
      this.currentMpp.set(undefined);
    } else {
      var value = mpp.material + '-' + mpp.id?.toString();
      this.currentMpp.set({ label: mpp.material || '', value: value || '' });
    }
  }

  filtrarMppPorProveedor(idProveedor: number) {
    this.mppServe.getMPP().subscribe(mpp => {
      this.mppFiltradas = mpp.filter(mp => mp.proveedorId === idProveedor);

      let mppConNombres: MateriaPrima[] = [];

      this.mppFiltradas.forEach(mp => {
        this.mpServe.getMateriaPrima().subscribe(materiaPrima => {
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

  getProveedorIdFromValue(value: string): number | undefined {
    const parts = value.split('-');
    const id = parts[1] ? parseInt(parts[1], 10) : undefined;
    return isNaN(id || 0) ? undefined : id;
  }
}
