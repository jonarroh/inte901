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
import { map, Observable, forkJoin, switchMap, tap, BehaviorSubject, combineLatest, of } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProveedoresService } from './service/proveedores.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
import { MateriaPrimaProveedor } from './interface/materiaPrimaProveedor';
import { Proveedor } from './interface/proveedor';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { HlmSelectContentDirective, HlmSelectOptionComponent, HlmSelectTriggerComponent, HlmSelectValueDirective } from '~/components/ui-select-helm/src';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';

interface ProveedorConMaterias extends Proveedor {
  materiasPrimas: string;
}

@Component({
  selector: 'app-proveedores',
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
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class ProveedoresComponent {
  proveedorService = inject(ProveedoresService);
  materiasPrimasService = inject(MateriasPrimasService);
  proveedores$: Observable<ProveedorConMaterias[]> = new Observable<ProveedorConMaterias[]>();
  materiasPrimas$: Observable<MateriaPrima[]>;
  materiaPrimaProveedor: MateriaPrimaProveedor = {};
  proveedor: Proveedor = {};
  editMode: boolean = false;
  selectedMateriasPrimas: number[] = [];
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // Column manager
  protected readonly _brnColumnManager = useBrnColumnManager({
    ID: {visible: true, label: 'ID', sortable: true},
    'Nombre Empresa': {visible: true, label: 'Nombre Empresa', sortable: true},
    'Dirección Empresa': {visible: true, label: 'Dirección Empresa', sortable: true},
    'Teléfono Empresa': {visible: true, label: 'Teléfono Empresa', sortable: true},
    'Nombre Encargado': {visible: true, label: 'Nombre Encargado', sortable: true},
    'Materias Primas': {visible: true, label: 'Materias Primas', sortable: true},
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
    this.refreshProveedores();
    this.materiasPrimas$ = this.materiasPrimasService.getMateriaPrima().pipe(
      map(materiasPrimas => materiasPrimas.filter(mp => mp.estatus === 1))
    );

    // Aplicar filtro sobre la lista de proveedores
    this.proveedores$ = combineLatest([
      this.proveedores$,
      this.filter$
    ]).pipe(
      map(([proveedores, filterValue]) =>
        proveedores.filter(proveedor =>
          proveedor.nombreEmpresa?.toLowerCase().includes(filterValue.toLowerCase())
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
    this.proveedores$.pipe(
      map(proveedores => {
        const start = this._displayedIndices().start;
        const end = this._displayedIndices().end + 1;
        this._totalElements.set(proveedores.length);
        return proveedores.slice(start, end);
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
    return proveedor.id!;
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
      this.proveedorService.registrarProveedor(this.proveedor).pipe(
        switchMap(response => {
          const materiaPrimaProveedores = this.selectedMateriasPrimas.map(materiaPrimaId => ({
            proveedorId: response.id,
            materiaPrimaId
          }));
          return forkJoin(materiaPrimaProveedores.map(materiaPrimaProveedor =>
            this.proveedorService.registrarMateriaPrimaProveedor(materiaPrimaProveedor)
          ));
        }),
        tap(() => {
          console.log('Proveedor y materias primas asociados');
          form.resetForm();
          this.proveedor = {};
          this.materiaPrimaProveedor = {};
          this.selectedMateriasPrimas = [];
          this.refreshProveedores();
        })
      ).subscribe();
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.proveedorService.editarProveedor(this.proveedor.id!, this.proveedor).pipe(
        switchMap(() => {
          return this.proveedorService.getMateriasPrimasProveedores().pipe(
            map(materiasPrimasProveedores =>
              materiasPrimasProveedores.filter(mpp => mpp.proveedorId === this.proveedor.id)
            ),
            switchMap(existingMateriasPrimasProveedores => {
              const toAdd = this.selectedMateriasPrimas.filter(
                mpId => !existingMateriasPrimasProveedores.some(emp => emp.materiaPrimaId === mpId)
              ).map(mpId => this.proveedorService.registrarMateriaPrimaProveedor({
                proveedorId: this.proveedor.id!,
                materiaPrimaId: mpId
              }));
              return forkJoin(toAdd);
            })
          );
        }),
        tap(() => {
          console.log('Proveedor y materias primas asociados');
          form.resetForm();
          this.proveedor = {};
          this.materiaPrimaProveedor = {};
          this.selectedMateriasPrimas = [];
          this.editMode = false;
          this.refreshProveedores();
        })
      ).subscribe();
    }
  }

  onAdd() {
    this.proveedor = {};
    this.selectedMateriasPrimas = [];
    const addButton = document.getElementById('add-proveedor-trigger');
    addButton?.click();
  }

  onEdit(proveedor: Proveedor) {
    this.proveedor = { ...proveedor };
    this.editMode = true;
    this.proveedorService.getMateriasPrimasProveedores().pipe(
      map(materiasPrimasProveedores =>
        materiasPrimasProveedores.filter(mpp => mpp.proveedorId === proveedor.id).map(mpp => mpp.materiaPrimaId!)
      ),
      tap(materiaPrimaIds => this.selectedMateriasPrimas = materiaPrimaIds)
    ).subscribe();
    const editButton = document.getElementById('edit-proveedor-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.proveedorService.eliminarProveedor(id).subscribe(() => {
      console.log('Proveedor eliminado');
      this.refreshProveedores();
    });
  }

  refreshProveedores() {
    this.proveedores$ = this.proveedorService.getProveedores().pipe(
      map(proveedores => proveedores.filter(proveedor => proveedor.estatus === 1)),
      switchMap(proveedores =>
        forkJoin(proveedores.map(proveedor =>
          this.proveedorService.getMateriasPrimasProveedores().pipe(
            map(materiasPrimasProveedores => materiasPrimasProveedores.filter(mpp => mpp.proveedorId === proveedor.id)),
            switchMap(materiasPrimasProveedores =>
              forkJoin(materiasPrimasProveedores.map(mpp =>
                this.materiasPrimasService.getMateriaPrimaById(mpp.materiaPrimaId!).pipe(
                  map(materiaPrima => materiaPrima.material)
                )
              ))
            ),
            map(materiasPrimas => ({
              ...proveedor,
              materiasPrimas: materiasPrimas.join(', ')
            }))
          )
        ))
      )
    );
  }
  
}
