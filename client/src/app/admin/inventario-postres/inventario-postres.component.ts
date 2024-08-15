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
import { InventarioPostre } from './interface/InventarioPostres';
import { InventarioPostresService } from './service/inventario-postres.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { ProductoService } from '../productos/service/producto.service';
import { Producto } from '../productos/interface/producto';
import { HlmSelectContentDirective, HlmSelectOptionComponent, HlmSelectTriggerComponent, HlmSelectValueDirective } from '~/components/ui-select-helm/src';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';

@Component({
  selector: 'app-inventario-postres',
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
  templateUrl: './inventario-postres.component.html',
  styleUrls: ['./inventario-postres.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class InventarioPostresComponent {
  inventarioPostresService = inject(InventarioPostresService);
  productoService = inject(ProductoService);

  inventarios$: Observable<InventarioPostre[]>;
  productos$: Observable<Producto[]>; // Observable para los productos
  inventario: InventarioPostre = {};
  editMode: boolean = false;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    'ID Postre': {visible: true, label: 'ID Postre', sortable: true},
    Producto: {visible: true, label: 'Producto', sortable: true},
    Cantidad: {visible: true, label: 'Cantidad', sortable: true},
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
    this.productos$ = this.productoService.getProductos().pipe(
      map(productos => productos.filter(producto => producto.estatus === 1))
    );

    this.inventarios$ = combineLatest([
      this.inventarioPostresService.getInventarios().pipe(
        map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
      ),
      this.productos$,
      this.filter$
    ]).pipe(
      map(([inventarios, productos, filterValue]) =>
        inventarios
          .map(inventario => ({
            ...inventario,
            nombreProducto: productos.find(p => p.id === inventario.idProducto)?.nombre || 'Desconocido'
          }))
          .filter(inventario =>
            inventario.nombreProducto?.toLowerCase().includes(filterValue.toLowerCase())
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
    return inventario.idPostre!;
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
      this.inventarioPostresService.registrarInventario(this.inventario).subscribe(response => {
        console.log('Inventario registrado:', response);
        form.resetForm();
        this.inventario = {}; // Reiniciar el objeto inventario
        this.refreshInventarios();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.inventarioPostresService.editarInventario(this.inventario.idPostre!, this.inventario).subscribe(response => {
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

  onEdit(inventario: InventarioPostre) {
    this.inventario = { ...inventario };
    this.editMode = true;
    const editButton = document.getElementById('edit-inventario-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.inventarioPostresService.eliminarInventario(id).subscribe(() => {
      console.log('Inventario eliminado');
      this.refreshInventarios();
    });
  }

  refreshInventarios() {
    this.inventarios$ = this.inventarioPostresService.getInventarios().pipe(
      map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
    );
  }
}
