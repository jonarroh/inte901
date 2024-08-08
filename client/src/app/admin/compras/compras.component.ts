import { Component, TrackByFunction, computed, effect, inject, signal } from '@angular/core';
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

type Framework = { label: string | '', value: string | '' };

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
  compraService = inject(ComprasService);
  compras$: Observable<Compra[]>;
  compra: Compra = {};
  detalles: DetailPurchase[] = [];
  proveedorService = inject(ProveedoresService);
  proveedores$: Observable<Proveedor[]>;
  insumos = inject(MateriasPrimasService);
  insumos$: Observable<MateriaPrima[]>;
  detalles$: Observable<DetailPurchase[]>;
  editMode: boolean = false;
  public frameworks: Framework[] = [];
  public currentFramework = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');

  constructor() {
    this.compras$ = this.compraService.getCompras();
    this.proveedores$ = this.proveedorService.getProveedores();
    this.insumos$ = this.insumos.getMateriaPrima();
    this.detalles$ = this.compraService.getDetailCompra(0) as Observable<DetailPurchase[]>;

    this.compras$.subscribe((compras) => {
      compras.forEach(element => {
        if (element.details && element.details.length > 0) {
          element.details.forEach(detail => {

          });
        }
      });
    });

    this.proveedores$.subscribe((proveedores) => {
      proveedores.forEach(proveedor => {
        return this.frameworks.push({ label: proveedor.nombreEmpresa || '', value: proveedor.nombreEmpresa || '' });
      });
    });
  }

  trackByCompraId: TrackByFunction<Compra> = (index, compra) => compra.id;

  protected readonly _proveedorFilter = signal('');
  protected readonly _rawFilterInput = signal('');
  protected readonly _brnColumnManager = useBrnColumnManager({
    proveedor: { visible: true, label: 'Proveedor' },
    user: { visible: true, label: 'Usuario' },
    status: { visible: true, label: 'Status' },
  });

  selectedProveedor: Proveedor | null = null;
  cantidad: number = 0;
  preciounitario: number = 0;
  selectedPresentacion: string = '';
  selectedInsumo: MateriaPrima | null = null;

  get unitType() {
    return this.selectedPresentacion.slice(-2);
  }

  addPurchase() {
    if (!this.selectedProveedor || !this.cantidad || !this.preciounitario || !this.selectedPresentacion || !this.selectedInsumo) {
      console.log('Please fill in all required fields');
      return;
    }

    const newPurchase: Compra = {
      idProveedor: this.selectedProveedor.id,
      idUser: 1,
      details: [
        {
          quantity: this.cantidad,
          priceSingle: this.preciounitario,
          presentation: this.selectedPresentacion,
          idProduct: this.selectedInsumo.id,
          unitType: this.unitType.toString(),
          status: "Pendiente"
        }
      ],
      status: "Pendiente"
    };

    this.compraService.createCompra(newPurchase).subscribe(
      () => {
        console.log('Compra agregada');

        this.selectedProveedor = null;
        this.cantidad = 0;
        this.preciounitario = 0;
        this.selectedPresentacion = '';
        this.selectedInsumo = null;
      },
      (error) => {
        console.error('Error al realizar la compra:', error);
      }
    );
  }

  editStatus(form: NgForm) {
    if (form.valid) {
      this.compraService.editCompra(this.compra).subscribe(
        (response) => {
          console.log('Compra actualizada:', response);
          form.resetForm();
          this.compra = {}; // Reiniciar el objeto compra
          this.editMode = false;
          this.compras$ = this.compraService.getCompras();
        }
      );
    }
  }

  editStatusDetalle(form: NgForm) {

  }

  onEdit(compra: Compra) {
    this.compra = { ...compra };
    this.editMode = true;

    const editButton = document.getElementById('edit-status');
    editButton?.click();
  }

  getCompraById(id: number) {
    this.compraService.getCompraById(id).subscribe(
      (compra) => {
        console.log('Compra encontrada:', compra);
        // Do something with the compra object
      },
      (error) => {
        console.error('Error al consultar la compra:', error);
      }
    );
  }

  getDetails(compra: Compra) {
    const id: number = compra.id || 0;

    this.compraService.getDetailCompra(id).subscribe(
      (compra) => {
        this.detalles$ = this.compraService.getDetailCompra(id) as Observable<DetailPurchase[]>;

        this.detalles = [compra];

        this.detalles.forEach(detail => {
          this.insumos$.subscribe(insumos => {
            return detail.product = insumos.find(insumo => insumo.id === detail.idProduct)?.material;
          });
        });

        const editButton = document.getElementById('edit-status-detail');
        editButton?.click();
        console.log('Detalles de la compra:', this.detalles);
      },
      (error) => {
        console.error('Error al consultar los detalles de la compra:', error);
      }
    );
  }

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentFramework()?.value === framework.value) {
      this.currentFramework.set(undefined);
    } else {
      this.currentFramework.set(framework);
    }
  }
}
