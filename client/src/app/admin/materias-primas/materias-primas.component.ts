import { Component, computed, effect, inject, signal } from '@angular/core';
import { MateriasPrimasService } from './service/materias-primas.service';
import { BehaviorSubject, combineLatest, combineLatestWith, map, Observable, of } from 'rxjs';
import { MateriaPrima } from './interface/materias-primas';
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
  selector: 'app-materias-primas',
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
  templateUrl: './materias-primas.component.html',
  styleUrls: ['./materias-primas.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class MateriasPrimasComponent {
  materiaService = inject(MateriasPrimasService);
  private materiasPrimasSource$: Observable<MateriaPrima[]>;
  materiasPrimas$: Observable<MateriaPrima[]>;
  materiaPrima: MateriaPrima = {};
  editMode: boolean = false;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: {visible: true, label: 'ID', sortable: true},
    Nombre: {visible: true, label: 'Nombre', sortable: true},
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
    this.materiasPrimasSource$ = this.materiaService.getMateriaPrima().pipe(
      map((materiasPrimas) => materiasPrimas.filter((materiaPrima) => materiaPrima.estatus === 1))
    );

    this.materiasPrimas$ = combineLatest([
      this.materiasPrimasSource$,
      this.filter$
    ]).pipe(
      map(([materiasPrimas, filterValue]) => 
        materiasPrimas.filter(materiaPrima => 
          materiaPrima.material?.toLowerCase().includes(filterValue.toLowerCase()) ?? false
        )
      ),
      map(filteredMateriasPrimas => {
        this._totalElements.set(filteredMateriasPrimas.length);
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        return filteredMateriasPrimas.slice(start, end);
      })
    );
  }

  private _updatePaginatedData() {
    this.materiasPrimasSource$.pipe(
      combineLatestWith(this.filter$),
      map(([materiasPrimas, filterValue]) => {
        // Filtrar los registros
        const filteredMateriasPrimas = materiasPrimas.filter(materiaPrima =>
          materiaPrima.material?.toLowerCase().includes(filterValue.toLowerCase()) ?? false
        );
  
        // Obtener los índices de paginación
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
  
        // Actualizar la cantidad total de elementos
        this._totalElements.set(filteredMateriasPrimas.length);
  
        // Retornar el subconjunto de datos basado en la paginación
        return filteredMateriasPrimas.slice(start, end);
      })
    ).subscribe(paginatedMateriasPrimas => {
      this.materiasPrimas$ = of(paginatedMateriasPrimas);
    });
  }
  

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
    this._updatePaginatedData();
  };

  trackByMateriaPrimaId(index: number, materiaPrima: any): number {
    return materiaPrima.id;
  }

  trackByColumnName(index: number, column: any): string {
    return column.name;
  }

  // Nueva propiedad computada para obtener el número de registros filtrados
protected readonly _filteredMateriasPrimas = computed(() => {
  let count = 0;
  this.materiasPrimas$.subscribe(materiasPrimas => count = materiasPrimas.length);
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
      this.materiaPrima.estatus = 1;
      this.materiaPrima.createdAt = new Date().toISOString();
      this.materiaPrima.updatedAt = new Date().toISOString();
      this.materiaService.registrarMateriaPrima(this.materiaPrima).subscribe((response) => {
        console.log('Materia prima registrada:', response);
        form.resetForm();
        this.materiaPrima = {}; // Reiniciar el objeto materia prima
        this.refreshMateriaPrima();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.materiaPrima.updatedAt = new Date().toISOString();
      this.materiaService.editarMateriaPrima(this.materiaPrima.id!, this.materiaPrima).subscribe((response) => {
        console.log('Materia prima actualizada:', response);
        form.resetForm();
        this.materiaPrima = {}; // Reiniciar el objeto materia prima
        this.editMode = false;
        this.refreshMateriaPrima();
      });
    }
  }

  onAdd() {
    this.materiaPrima = {}; // Limpiar el objeto materia prima antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-materia-trigger');
    addButton?.click();
  }

  onEdit(materiaPrima: MateriaPrima) {
    this.materiaPrima = { ...materiaPrima };
    this.editMode = true;
    const editButton = document.getElementById('edit-materia-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.materiaService.eliminarMateriaPrima(id).subscribe(() => {
      console.log('Materia prima eliminada');
      this.refreshMateriaPrima();
    });
  }

  refreshMateriaPrima() {
    this.materiasPrimas$ = this.materiaService.getMateriaPrima().pipe(
      map((materiasPrimas) =>
        materiasPrimas.filter((materiaPrima) => materiaPrima.estatus === 1)
      )
    );
  }
}
