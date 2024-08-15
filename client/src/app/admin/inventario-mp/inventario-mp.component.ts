import { Component, computed, inject, signal } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '~/components/ui-dialog-helm/src';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { BrnDialogTriggerDirective, BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { BehaviorSubject, combineLatest, from, map, Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { InventarioMP } from './interface/inventarioMP';
import { InventarioMPService } from './service/inventario-mp.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
import { HlmSelectContentDirective, HlmSelectOptionComponent, HlmSelectTriggerComponent, HlmSelectValueDirective } from '~/components/ui-select-helm/src';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';

@Component({
  selector: 'app-inventario-mp',
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
    HlmIconComponent,
    HlmSelectTriggerComponent,
    HlmSelectValueDirective,
    HlmSelectContentDirective,
    HlmSelectOptionComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    BrnSelectImports,
    HlmInputDirective,
    CommonModule,
    AsyncPipe,
    FormsModule,
    BrnTableModule,
    HlmTableModule,
    BrnMenuTriggerDirective,
    HlmMenuModule,
  ],
  templateUrl: './inventario-mp.component.html',
  styleUrls: ['./inventario-mp.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class InventarioMPComponent {
  inventarioMPService = inject(InventarioMPService);
  materiasPrimasService = inject(MateriasPrimasService);

  inventarios$: Observable<InventarioMP[]>;
  materiasPrimas$: Observable<MateriaPrima[]>;
  inventario: InventarioMP = {};
  editMode: boolean = false;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: {visible: true, label: 'ID', sortable: true},
    'Materia Prima': {visible: true, label: 'Materia Prima', sortable: true},
    Cantidad: {visible: true, label: 'Cantidad', sortable: true},
    'Unidad de Medida': {visible: true, label: 'Unidad de Medida', sortable: true},
    'ID Compra': {visible: true, label: 'ID Compra', sortable: true},
    Caducidad: {visible: true, label: 'Caducidad', sortable: true},
  });

  // Columnas visibles
  protected readonly displayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  // Paginación
  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);
  protected readonly _totalElements = signal(0);

  constructor() {
    this.materiasPrimas$ = this.materiasPrimasService.getMateriaPrima().pipe(
      map(materiasPrimas => materiasPrimas.filter(materiaPrima => materiaPrima.estatus === 1))
    );

    this.inventarios$ = combineLatest([
      this.inventarioMPService.getInventarios().pipe(
        map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
      ),
      this.materiasPrimas$,
      this.filter$
    ]).pipe(
      map(([inventarios, materiasPrimas, filterValue]) =>
        inventarios
          .map(inventario => ({
            ...inventario,
            nombreMateriaPrima: materiasPrimas.find(mp => mp.id === inventario.idMateriaPrima)?.material || 'Desconocido'
          }))
          .filter(inventario =>
            inventario.nombreMateriaPrima?.toLowerCase().includes(filterValue.toLowerCase())
          )
      ),
      map(filteredInventarios => {
        this._totalElements.set(filteredInventarios.length);
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        return filteredInventarios.slice(start, end);
      })
    );
  }

  private _updatePaginatedData() {
    this.inventarios$.pipe(
      map(inventarios => {
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        this._totalElements.set(inventarios.length);
        return inventarios.slice(start, end);
      })
    ).subscribe(paginatedInventarios => {
      this.inventarios$ = of(paginatedInventarios);
    });
  }

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
    this._updatePaginatedData();
  };

  trackByInventarioId(index: number, inventario: any): number {
    return inventario.id!;
  }

  trackByColumnName(index: number, column: any): string {
    return column.name;
  }

  applyFilter(filterValue: string) {
    this.filterSubject.next(filterValue);
  }

  applyFilterFromEvent(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.applyFilter(inputElement.value);
  }


  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.inventario.estatus = 1;
      this.inventario.createdAt = new Date().toISOString();
      this.inventarioMPService.registrarInventario(this.inventario).subscribe(response => {
        console.log('Inventario registrado:', response);
        form.resetForm();
        this.inventario = {}; // Reiniciar el objeto inventario
        this.refreshInventarios();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.inventarioMPService.editarInventario(this.inventario.id!, this.inventario).subscribe(response => {
        console.log('Inventario actualizado:', response);
        form.resetForm();
        this.inventario = {}; // Reiniciar el objeto inventario
        this.editMode = false;
        this.refreshInventarios();
      });
    }
  }

  onAdd() {
    this.inventario = {}; // Limpiar el objeto inventario antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-inventario-trigger');
    addButton?.click();
  }

  onEdit(inventario: InventarioMP) {
    this.inventario = { ...inventario };
    this.editMode = true;
    const editButton = document.getElementById('edit-inventario-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.inventarioMPService.eliminarInventario(id).subscribe(() => {
      console.log('Inventario eliminado');
      this.refreshInventarios();
    });
  }

  refreshInventarios() {
    this.inventarios$ = this.inventarioMPService.getInventarios().pipe(
      map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
    );
  }
}