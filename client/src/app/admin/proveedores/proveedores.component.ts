import { Component, computed, inject, signal } from '@angular/core';
import { ProveedoresService } from './service/proveedores.service';
import { BehaviorSubject, combineLatest, combineLatestWith, map, Observable, of } from 'rxjs';
import { Proveedor } from './interface/proveedor';
import { FormsModule, NgForm } from '@angular/forms';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '~/components/ui-dialog-helm/src';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { HlmSelectContentDirective, HlmSelectOptionComponent, HlmSelectTriggerComponent, HlmSelectValueDirective } from '~/components/ui-select-helm/src';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmButtonDirective,
    HlmInputDirective,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmIconComponent,
    HlmSelectTriggerComponent,
    HlmSelectValueDirective,
    HlmSelectContentDirective,
    HlmSelectOptionComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    BrnTableModule,
    BrnSelectImports,
    FormsModule,
    CommonModule,
    AsyncPipe,
    BrnTableModule,
    HlmTableModule,
    BrnMenuTriggerDirective,
    HlmMenuModule,
  ],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class ProveedoresComponent {
  proveedoresService = inject(ProveedoresService);
  private proveedoresSource$: Observable<Proveedor[]>;
  proveedores$: Observable<Proveedor[]>;
  proveedor: Proveedor = {};
  editMode: boolean = false;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: { visible: true, label: 'ID', sortable: true },
    'Nombre Empresa': { visible: true, label: 'Nombre Empresa', sortable: true },
    'Dirección Empresa': { visible: true, label: 'Dirección Empresa', sortable: true },
    'Teléfono Empresa': { visible: true, label: 'Teléfono Empresa', sortable: true },
    'Nombre Encargado': { visible: true, label: 'Nombre Encargado', sortable: true },
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
    this.proveedoresSource$ = this.proveedoresService.getProveedores().pipe(
      map((proveedores) => proveedores.filter((proveedor) => proveedor.estatus === 1))
    );

    this.proveedores$ = combineLatest([
      this.proveedoresSource$,
      this.filter$
    ]).pipe(
      map(([proveedores, filterValue]) => 
        proveedores.filter(proveedor => 
          proveedor.nombreEmpresa?.toLowerCase().includes(filterValue.toLowerCase()) ?? false
        )
      ),
      map(filteredProveedores => {
        this._totalElements.set(filteredProveedores.length);
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        return filteredProveedores.slice(start, end);
      })
    );
  }

  private _updatePaginatedData() {
    this.proveedoresSource$.pipe(
      combineLatestWith(this.filter$),
      map(([proveedores, filterValue]) => {
        // Filtrar los registros
        const filteredProveedores = proveedores.filter(proveedor =>
          proveedor.nombreEmpresa?.toLowerCase().includes(filterValue.toLowerCase()) ?? false
        );
  
        // Obtener los índices de paginación
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
  
        // Actualizar la cantidad total de elementos
        this._totalElements.set(filteredProveedores.length);
  
        // Retornar el subconjunto de datos basado en la paginación
        return filteredProveedores.slice(start, end);
      })
    ).subscribe(paginatedProveedores => {
      this.proveedores$ = of(paginatedProveedores);
    });
  }

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
    this._updatePaginatedData();
  };

  trackByProveedorId(index: number, proveedor: any): number {
    return proveedor.id;
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
      this.proveedor.estatus = 1;
      this.proveedor.createdAt = new Date().toISOString();
      this.proveedoresService.registrarProveedor(this.proveedor).subscribe((response) => {
        console.log('Proveedor registrado:', response);
        form.resetForm();
        this.proveedor = {}; // Reiniciar el objeto proveedor
        this.refreshProveedores();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.proveedor.updatedAt = new Date().toISOString();
      this.proveedoresService.editarProveedor(this.proveedor.id!, this.proveedor).subscribe((response) => {
        console.log('Proveedor actualizado:', response);
        form.resetForm();
        this.proveedor = {}; // Reiniciar el objeto proveedor
        this.editMode = false;
        this.refreshProveedores();
      });
    }
  }

  onAdd() {
    this.proveedor = {}; // Limpiar el objeto proveedor antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-proveedor-trigger');
    addButton?.click();
  }

  onEdit(proveedor: Proveedor) {
    this.proveedor = { ...proveedor };
    this.editMode = true;
    const editButton = document.getElementById('edit-proveedor-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.proveedoresService.eliminarProveedor(id).subscribe(() => {
      console.log('Proveedor eliminado');
      this.refreshProveedores();
    });
  }

  refreshProveedores() {
    location.reload();
  }
}
