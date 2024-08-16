import { Component, computed, effect, inject, signal } from '@angular/core';
import { IngredienteService } from './service/ingrediente.service';
import { ProductoService } from '../productos/service/producto.service';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { BehaviorSubject, combineLatest, combineLatestWith, map, Observable, of } from 'rxjs';
import { Ingrediente } from './interface/ingrediente';
import { Producto } from '../productos/interface/producto';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
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

interface IngredienteExtendido extends Ingrediente {
  material?: string;
  nombreProducto?: string;
}

@Component({
  selector: 'app-ingredientes',
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
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class IngredientesComponent {
  ingredienteService = inject(IngredienteService);
  productoService = inject(ProductoService);
  materiasPrimasService = inject(MateriasPrimasService);

  private ingredientesSource$: Observable<IngredienteExtendido[]>;
  ingredientes$: Observable<IngredienteExtendido[]>;
  ingrediente: Ingrediente = {};
  editMode: boolean = false;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  productos$: Observable<Producto[]>;
  materiasPrimas$: Observable<MateriaPrima[]>;

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: { visible: true, label: 'ID', sortable: true },
    nombreProducto: { visible: true, label: 'Producto', sortable: true },
    material: { visible: true, label: 'Materia Prima', sortable: true },
    cantidad: { visible: true, label: 'Cantidad', sortable: true },
    unidadMedida: { visible: true, label: 'Unidad de Medida', sortable: true },
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
    this.productos$ = this.productoService.getProductos();
    this.materiasPrimas$ = this.materiasPrimasService.getMateriaPrima();

    this.ingredientesSource$ = combineLatest([
      this.ingredienteService.getIngredientes(),
      this.productos$,
      this.materiasPrimas$
    ]).pipe(
      map(([ingredientes, productos, materiasPrimas]) =>
        ingredientes.map(ingrediente => ({
          ...ingrediente,
          nombreProducto: productos.find(p => p.id === ingrediente.idProducto)?.nombre,
          material: materiasPrimas.find(mp => mp.id === ingrediente.idMateriaPrima)?.material
        }))
      )
    );

    this.ingredientes$ = combineLatest([
      this.ingredientesSource$,
      this.filter$
    ]).pipe(
      map(([ingredientes, filterValue]) =>
        ingredientes.filter(ingrediente =>
          (ingrediente.nombreProducto?.toString().includes(filterValue) ?? false) ||
          (ingrediente.material?.toString().includes(filterValue) ?? false)
        )
      ),
      map(filteredIngredientes => {
        this._totalElements.set(filteredIngredientes.length);
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        return filteredIngredientes.slice(start, end);
      })
    );
  }

  private _updatePaginatedData() {
    this.ingredientesSource$.pipe(
      combineLatestWith(this.filter$),
      map(([ingredientes, filterValue]) => {
        // Filtrar los registros
        const filteredIngredientes = ingredientes.filter(ingrediente =>
          (ingrediente.nombreProducto?.toString().includes(filterValue) ?? false) ||
          (ingrediente.material?.toString().includes(filterValue) ?? false)
        );

        // Obtener los índices de paginación
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;

        // Actualizar la cantidad total de elementos
        this._totalElements.set(filteredIngredientes.length);

        // Retornar el subconjunto de datos basado en la paginación
        return filteredIngredientes.slice(start, end);
      })
    ).subscribe(paginatedIngredientes => {
      this.ingredientes$ = of(paginatedIngredientes);
    });
  }

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
    this._updatePaginatedData();
  };

  trackByIngredienteId(index: number, ingrediente: any): number {
    return ingrediente.id;
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
      this.ingrediente.estatus = 1;
      this.ingrediente.createdAt = new Date().toISOString();
      this.ingrediente.updatedAt = new Date().toISOString();
      this.ingredienteService.registrarIngrediente(this.ingrediente).subscribe((response) => {
        console.log('Ingrediente registrado:', response);
        form.resetForm();
        this.ingrediente = {}; // Reiniciar el objeto ingrediente
        this.refreshIngrediente();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.ingrediente.updatedAt = new Date().toISOString();
      this.ingredienteService.editarIngrediente(this.ingrediente.id!, this.ingrediente).subscribe((response) => {
        console.log('Ingrediente actualizado:', response);
        form.resetForm();
        this.ingrediente = {}; // Reiniciar el objeto ingrediente
        this.editMode = false;
        this.refreshIngrediente();
      });
    }
  }

  onAdd() {
    this.ingrediente = {}; // Limpiar el objeto ingrediente antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-ingrediente-trigger');
    addButton?.click();
  }

  onEdit(ingrediente: Ingrediente) {
    this.ingrediente = { ...ingrediente };
    this.editMode = true;
    const editButton = document.getElementById('edit-ingrediente-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.ingredienteService.eliminarIngrediente(id).subscribe(() => {
      console.log('Ingrediente eliminado');
      this.refreshIngrediente();
    });
  }

  refreshIngrediente() {
    this.ingredientes$ = this.ingredienteService.getIngredientes().pipe(
      map((ingredientes) =>
        ingredientes.filter((ingrediente) => ingrediente.estatus === 1)
      )
    );
  }
}
