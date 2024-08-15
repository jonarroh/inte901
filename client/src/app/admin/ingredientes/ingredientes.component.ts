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
import { Ingrediente } from './interface/ingrediente';
import { IngredienteService } from './service/ingrediente.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { ProductoService } from '../productos/service/producto.service';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { Producto } from '../productos/interface/producto';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectContentDirective, HlmSelectOptionComponent, HlmSelectTriggerComponent, HlmSelectValueDirective } from '~/components/ui-select-helm/src';

@Component({
  selector: 'app-ingredientes',
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
  materiaPrimaService = inject(MateriasPrimasService);

  ingredientes$: Observable<Ingrediente[]>;
  productos$: Observable<Producto[]>;
  materiasPrimas$: Observable<MateriaPrima[]>;

  ingrediente: Ingrediente = {};
  editMode: boolean = false;

  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: {visible: true, label: 'ID', sortable: true},
    Producto: {visible: true, label: 'Producto', sortable: true},
    'Materia Prima': {visible: true, label: 'Materia Prima', sortable: true},
    Cantidad: {visible: true, label: 'Cantidad', sortable: true},
    'Unidad de Medida': {visible: true, label: 'Unidad de Medida', sortable: true},
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
      map((productos) => productos.filter((producto) => producto.estatus === 1))
    );

    this.materiasPrimas$ = this.materiaPrimaService.getMateriaPrima().pipe(
      map((materiasPrimas) =>
        materiasPrimas.filter((materiaPrima) => materiaPrima.estatus === 1)
      )
    );

    this.ingredientes$ = combineLatest([
      this.ingredienteService.getIngredientes().pipe(
        map((ingredientes) =>
          ingredientes.filter((ingrediente) => ingrediente.estatus === 1)
        )
      ),
      this.productos$,
      this.materiasPrimas$,
      this.filter$
    ]).pipe(
      map(([ingredientes, productos, materiasPrimas, filterValue]) => 
        ingredientes
          .map((ingrediente) => ({
            ...ingrediente,
            nombreProducto: productos.find(p => p.id === ingrediente.idProducto)?.nombre || 'Desconocido',
            nombreMateriaPrima: materiasPrimas.find(mp => mp.id === ingrediente.idMateriaPrima)?.material || 'Desconocido',
          }))
          .filter(ingrediente =>
            ingrediente.nombreProducto?.toLowerCase().includes(filterValue.toLowerCase())
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
    this.ingredientes$.pipe(
      map(ingredientes => {
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        this._totalElements.set(ingredientes.length);
        return ingredientes.slice(start, end);
      })
    ).subscribe(paginatedIngredientes => {
      this.ingredientes$ = of(paginatedIngredientes);
    });
  }

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
    this._updatePaginatedData();
  };

  trackByIngredientId(index: number, ingredient: any): number {
    return ingredient.id!;
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
      this.ingredienteService.registrarIngredientes(this.ingrediente).subscribe((response) => {
        console.log('Ingrediente registrado:', response);
        form.resetForm();
        this.ingrediente = {}; // Reiniciar el objeto ingrediente
        this.refreshIngredientes();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.ingredienteService.editarIngrediente(this.ingrediente.id!, this.ingrediente).subscribe((response) => {
        console.log('Ingrediente actualizado:', response);
        form.resetForm();
        this.ingrediente = {}; // Reiniciar el objeto ingrediente
        this.editMode = false;
        this.refreshIngredientes();
      });
    }
  }

  onAdd() {
    this.ingrediente = {}; // Limpiar el objeto ingrediente antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-ingredient-trigger');
    addButton?.click();
  }

  onEdit(ingredient: Ingrediente) {
    this.ingrediente = { ...ingredient };
    this.editMode = true;
    const editButton = document.getElementById('edit-ingredient-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.ingredienteService.eliminarIngrediente(id).subscribe(() => {
      console.log('Ingrediente eliminado');
      this.refreshIngredientes();
    });
  }

  refreshIngredientes() {
    this.ingredientes$ = this.ingredienteService.getIngredientes().pipe(
      map((ingredientes) =>
        ingredientes.filter((ingrediente) => ingrediente.estatus === 1)
      )
    );
  }
}
