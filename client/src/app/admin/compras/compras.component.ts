import { Component, TrackByFunction, computed, effect, inject, signal } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';
import {
  HlmDialogComponent, HlmDialogContentComponent, HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '~/components/ui-dialog-helm/src';

import { FormsModule } from '@angular/forms';
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

  constructor() {
    this.compras$ = this.compraService.getCompras();
    this.proveedores$ = this.proveedorService.getProveedores();

    this.compras$.subscribe((compras) => {
      compras.forEach(element => {
        console.log('Element:', element);

        if (element.detailPurchases && element.detailPurchases.length > 0) {
          console.log('Detail Purchases:', element.detailPurchases);
          element.detailPurchases.forEach(detail => {
            console.log('Detail Purchase:', detail);
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


}
