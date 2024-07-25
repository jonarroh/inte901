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
import { HlmInputDirective } from '~/components/ui-input-helm/src';
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
import { from,debounceTime, map, Observable } from 'rxjs';
import { ComprasService } from './compras.service';
import { Compra } from './interface/compras';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent {
  compraService = inject(ComprasService);
  compras$: Observable<Compra[]>;
  compra: Compra = {};

  constructor() {
    this.compras$ = this.compraService.getCompras();
  }

  trackByCompraId: TrackByFunction<Compra> = (index, compra) => compra.id;
}
