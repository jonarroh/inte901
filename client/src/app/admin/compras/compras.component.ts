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
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { BrnDialogTriggerDirective, BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SelectionModel } from '@angular/cdk/collections';
import { from, debounceTime, map, Observable } from 'rxjs';
import { ComprasService } from './compras.service';
import { Compra } from './interface/compras';
import { CommonModule } from '@angular/common';
import { Proveedor } from './interface/proveedor';
import { ProveedoresService } from '~/app/proveedores/proveedores.service';
import { HlmAccordionDirective, HlmAccordionModule } from '~/components/ui-accordion-helm/src';
import { BrnAccordionModule } from '@spartan-ng/ui-accordion-brain';
import { ProductoService } from '../productos/service/producto.service';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';

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
    BrnAccordionModule
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
  proveedorService = inject(ProveedoresService);
  proveedores$: Observable<Proveedor[]>;
  insumos = inject(MateriasPrimasService);
  insumos$: Observable<MateriaPrima[]>;
  editMode: boolean = false;

  constructor() {
    this.compras$ = this.compraService.getCompras();
    this.proveedores$ = this.proveedorService.getProveedores();
    this.insumos$ = this.insumos.getMateriaPrima();

    this.compras$.subscribe((compras) => {
      compras.forEach(element => {
        // console.log('Element:', element);

        if (element.details && element.details.length > 0) {
          // console.log('Detail Purchases:', element.details);
          element.details.forEach(detail => {
            // console.log('Detail Purchase:', detail);
          });
        }
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
      idUser: 1, // Hardcoded for now
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

        // Reset the form fields
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

  getDetails(id: number) {
    this.compraService.getDetailCompra(id).subscribe(
      (compra) => {
        console.log('Detalles de la compra:', compra);
        // Do something with the compra object
      },
      (error) => {
        console.error('Error al consultar los detalles de la compra:', error);
      }
    );
  }
}
