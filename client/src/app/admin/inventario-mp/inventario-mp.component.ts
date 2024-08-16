import { Component, computed, effect, inject, signal } from '@angular/core';
import { InventarioMPService } from './service/inventario-mp.service';
import { BehaviorSubject, combineLatest, combineLatestWith, map, Observable, of } from 'rxjs';
import { InventarioMP } from './interface/inventarioMP';
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
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';

export interface InventarioMPExtended extends InventarioMP {
  material?: string;
}

@Component({
  selector: 'app-inventario-mp',
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
  templateUrl: './inventario-mp.component.html',
  styleUrls: ['./inventario-mp.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class InventarioMPComponent {
  inventarioService = inject(InventarioMPService);
  materiasPrimasService = inject(MateriasPrimasService);

  private inventariosMPSource$: Observable<InventarioMPExtended[]>;
  inventariosMP$: Observable<InventarioMP[]>;
  inventarioMP: InventarioMPExtended = {};
  materiasPrimas: MateriaPrima[] = [];
  editMode: boolean = false;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: {visible: true, label: 'ID', sortable: true},
    MateriaPrima: {visible: true, label: 'Materia Prima', sortable: true},
    UnidadMedida: {visible: true, label: 'Unidad Medida', sortable: true},
    Cantidad: {visible: true, label: 'Cantidad', sortable: true},
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
    this.materiasPrimasService.getMateriaPrima().subscribe((materias) => {
      this.materiasPrimas = materias;
    });

    this.inventariosMPSource$ = this.inventarioService.getInventarioMP().pipe(
      map((inventariosMP: InventarioMPExtended[]) => {
        return inventariosMP.map((inventario) => {
          const materiaPrima = this.materiasPrimas.find(mp => mp.id === inventario.idMateriaPrima);
          return {
            ...inventario,
            material: materiaPrima ? materiaPrima.material : 'N/A'
          };
        }).filter((inventario) => inventario.estatus === 1);
      })
    );

    this.inventariosMP$ = combineLatest([this.inventariosMPSource$, this.filter$]).pipe(
      map(([inventariosMP, filterValue]) => 
        inventariosMP.filter(inventario => 
          inventario.material?.toLowerCase().includes(filterValue.toLowerCase()) ||
          inventario.cantidad?.toString().includes(filterValue)
        )
      ),
      map(filteredInventariosMP => {
        this._totalElements.set(filteredInventariosMP.length);
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        return filteredInventariosMP.slice(start, end);
      })
    );
  }


  private _updatePaginatedData() {
    this.inventariosMPSource$.pipe(
      combineLatestWith(this.filter$),
      map(([inventariosMP, filterValue]) => {
        // Filtrar los registros
        const filteredInventariosMP = inventariosMP.filter(inventario =>
          inventario.idMateriaPrima?.toString().includes(filterValue) ||
          inventario.cantidad?.toString().includes(filterValue)
        );
  
        // Obtener los índices de paginación
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
  
        // Actualizar la cantidad total de elementos
        this._totalElements.set(filteredInventariosMP.length);
  
        // Retornar el subconjunto de datos basado en la paginación
        return filteredInventariosMP.slice(start, end);
      })
    ).subscribe(paginatedInventariosMP => {
      this.inventariosMP$ = of(paginatedInventariosMP);
    });
  }
  

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
    this._updatePaginatedData();
  };

  trackByInventarioId(index: number, inventario: any): number {
    return inventario.id;
  }

  trackByColumnName(index: number, column: any): string {
    return column.name;
  }

  // Nueva propiedad computada para obtener el número de registros filtrados
  protected readonly _filteredInventariosMP = computed(() => {
    let count = 0;
    this.inventariosMP$.subscribe(inventariosMP => count = inventariosMP.length);
    return count;
  });

  applyFilter(filterValue: string) {
    this.filterSubject.next(filterValue);
  }

  applyFilterFromEvent(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.applyFilter(inputElement.value);
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.inventarioMP.estatus = 1;
      this.inventarioMP.createdAt = new Date().toISOString();
      this.inventarioService.registrarInventarioMP(this.inventarioMP).subscribe((response) => {
        console.log('Inventario registrado:', response);
        form.resetForm();
        this.inventarioMP = {}; // Reiniciar el objeto inventario
        this.refreshInventarioMP();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.inventarioService.editarInventarioMP(this.inventarioMP.id!, this.inventarioMP).subscribe((response) => {
        console.log('Inventario actualizado:', response);
        form.resetForm();
        this.inventarioMP = {}; // Reiniciar el objeto inventario
        this.editMode = false;
        this.refreshInventarioMP();
      });
    }
  }

  onAdd() {
    this.inventarioMP = {}; // Limpiar el objeto inventario antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-inventario-trigger');
    addButton?.click();
  }

  onEdit(inventario: InventarioMP) {
    this.inventarioMP = { ...inventario };
    this.editMode = true;
    const editButton = document.getElementById('edit-inventario-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.inventarioService.eliminarInventarioMP(id).subscribe(() => {
      console.log('Inventario eliminado');
      this.refreshInventarioMP();
    });
  }

  refreshInventarioMP() {
    this.inventariosMP$ = this.inventarioService.getInventarioMP().pipe(
      map((inventariosMP) =>
        inventariosMP.filter((inventario) => inventario.estatus === 1)
      )
    );
  }
}
