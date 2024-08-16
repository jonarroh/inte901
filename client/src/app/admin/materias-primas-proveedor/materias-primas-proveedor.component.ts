import { Component, computed, inject, signal } from '@angular/core';
import { MateriasPrimasProveedorService } from './service/materias-primas-proveedor.service';
import { ProveedoresService } from '../proveedores/service/proveedores.service';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { BehaviorSubject, combineLatest, combineLatestWith, map, Observable, of } from 'rxjs';
import { MateriaPrimaProveedor } from './interface/materiaPrimaProveedor';
import { Proveedor } from '../proveedores/interface/proveedor';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '~/components/ui-dialog-helm/src';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { HlmSelectContentDirective, HlmSelectOptionComponent, HlmSelectTriggerComponent, HlmSelectValueDirective } from '~/components/ui-select-helm/src';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';

interface MateriaPrimaProveedorExtendido extends MateriaPrimaProveedor {
  material?: string;
  nombreEmpresa?: string;
}

@Component({
  selector: 'app-materias-primas-proveedor',
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
    BrnSelectImports,
    FormsModule,
    CommonModule,
    AsyncPipe,
    BrnTableModule,
    HlmTableModule,
    BrnMenuTriggerDirective,
    HlmMenuModule,
  ],
  templateUrl: './materias-primas-proveedor.component.html',
  styleUrls: ['./materias-primas-proveedor.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class MateriasPrimasProveedorComponent {
  materiaPrimaProveedorService = inject(MateriasPrimasProveedorService);
  proveedorService = inject(ProveedoresService);
  materiasPrimasService = inject(MateriasPrimasService);

  private materiasPrimasProveedorSource$: Observable<MateriaPrimaProveedorExtendido[]>;
  materiasPrimasProveedor$: Observable<MateriaPrimaProveedorExtendido[]>;
  materiaPrimaProveedor: MateriaPrimaProveedor = {};
  editMode: boolean = false;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  proveedores$: Observable<Proveedor[]>;
  materiasPrimas$: Observable<MateriaPrima[]>;

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: { visible: true, label: 'ID', sortable: true },
    nombreEmpresa: { visible: true, label: 'Proveedor', sortable: true },
    material: { visible: true, label: 'Materia Prima', sortable: true },
    actions: { visible: true, label: 'Acciones', sortable: false },
  });

  // Columnas visibles
  protected readonly displayedColumns = computed(() => [
    ...this._brnColumnManager.displayedColumns(),
  ]);

  // Paginación
  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);
  protected readonly _totalElements = signal(0);

  constructor() {
    this.proveedores$ = this.proveedorService.getProveedores();
    this.materiasPrimas$ = this.materiasPrimasService.getMateriaPrima();

    this.materiasPrimasProveedorSource$ = combineLatest([
      this.materiaPrimaProveedorService.getMateriasPrimasProveedor(),
      this.proveedores$,
      this.materiasPrimas$
    ]).pipe(
      map(([materiasPrimasProveedor, proveedores, materiasPrimas]) =>
        materiasPrimasProveedor.map(materiaPrimaProveedor => ({
          ...materiaPrimaProveedor,
          nombreEmpresa: proveedores.find(p => p.id === materiaPrimaProveedor.proveedorId)?.nombreEmpresa,
          material: materiasPrimas.find(mp => mp.id === materiaPrimaProveedor.materiaPrimaId)?.material
        }))
      )
    );

    this.materiasPrimasProveedor$ = combineLatest([
      this.materiasPrimasProveedorSource$,
      this.filter$
    ]).pipe(
      map(([materiasPrimasProveedor, filterValue]) =>
        materiasPrimasProveedor.filter(materiaPrimaProveedor =>
          (materiaPrimaProveedor.nombreEmpresa?.toString().toLowerCase().includes(filterValue.toLowerCase()) ?? false)
        )
      ),
      map(filteredMateriasPrimasProveedor => {
        this._totalElements.set(filteredMateriasPrimasProveedor.length);
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        return filteredMateriasPrimasProveedor.slice(start, end);
      })
    );
  }

  private _updatePaginatedData() {
    this.materiasPrimasProveedorSource$.pipe(
      combineLatestWith(this.filter$),
      map(([materiasPrimasProveedor, filterValue]) => {
        const filteredMateriasPrimasProveedor = materiasPrimasProveedor.filter(materiaPrimaProveedor =>
          (materiaPrimaProveedor.nombreEmpresa?.toString().toLowerCase().includes(filterValue.toLowerCase()) ?? false)
        );

        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;

        this._totalElements.set(filteredMateriasPrimasProveedor.length);

        return filteredMateriasPrimasProveedor.slice(start, end);
      })
    ).subscribe(paginatedMateriasPrimasProveedor => {
      this.materiasPrimasProveedor$ = of(paginatedMateriasPrimasProveedor);
    });
  }

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
    this._updatePaginatedData();
  };

  trackByMateriaPrimaProveedorId(index: number, materiaPrimaProveedor: any): number {
    return materiaPrimaProveedor.id;
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
      this.materiaPrimaProveedor.estatus = 1;
      this.materiaPrimaProveedorService.registrarMateriaPrimaProveedor(this.materiaPrimaProveedor).subscribe((response) => {
        console.log('Materia Prima Proveedor registrada:', response);
        form.resetForm();
        this.materiaPrimaProveedor = {}; // Reiniciar el objeto
        this.refreshMateriaPrimaProveedor();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.materiaPrimaProveedorService.editarMateriaPrimaProveedor(this.materiaPrimaProveedor.id!, this.materiaPrimaProveedor).subscribe((response) => {
        console.log('Materia Prima Proveedor actualizada:', response);
        form.resetForm();
        this.materiaPrimaProveedor = {}; // Reiniciar el objeto
        this.editMode = false;
        this.refreshMateriaPrimaProveedor();
      });
    }
  }

  onAdd() {
    this.materiaPrimaProveedor = {}; // Limpiar el objeto antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-materiaPrimaProveedor-trigger');
    addButton?.click();
  }

  onEdit(materiaPrimaProveedor: MateriaPrimaProveedor) {
    this.materiaPrimaProveedor = { ...materiaPrimaProveedor };
    this.editMode = true;
    const editButton = document.getElementById('edit-materiaPrimaProveedor-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.materiaPrimaProveedorService.eliminarMateriaPrimaProveedor(id).subscribe(() => {
      console.log('Materia Prima Proveedor eliminada');
      this.refreshMateriaPrimaProveedor();
    });
  }

  refreshMateriaPrimaProveedor() {
    this.materiasPrimasProveedor$ = this.materiaPrimaProveedorService.getMateriasPrimasProveedor().pipe(
      map((materiasPrimasProveedor) =>
        materiasPrimasProveedor.filter((materiaPrimaProveedor) => materiaPrimaProveedor.estatus === 1)
      )
    );
  }
}