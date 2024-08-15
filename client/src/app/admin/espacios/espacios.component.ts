import { Component, computed, effect, OnInit, signal, TrackByFunction } from '@angular/core';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { Espacio } from '~/lib/types';
import { EspacioSerService } from './espacio-ser.service';
import { HttpClient } from '@angular/common/http';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '~/components/ui-dialog-helm/src';
import { LucideAngularModule } from 'lucide-angular';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { HlmLabelDirective } from '~/components/ui-label-helm/src';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { createFormField, createFormGroup, SignalInputDirective, V } from 'ng-signal-forms';
import { BrnSelectImports, BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { FormsModule } from '@angular/forms';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '~/components/ui-command-helm/src';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { CommonModule, DecimalPipe, NgForOf, TitleCasePipe } from '@angular/common';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '~/components/ui-menu-helm/src';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '~/components/ui-table-helm/src';
import { HlmCheckboxCheckIconComponent, HlmCheckboxComponent } from '~/components/ui-checkbox-helm/src';
import { SelectionModel } from '@angular/cdk/collections';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [
    NavbarComponent, HlmDialogComponent, HlmDialogContentComponent, HlmDialogFooterComponent,
  LucideAngularModule, BrnDialogContentDirective, BrnDialogTriggerDirective, HlmDialogHeaderComponent,
  HlmDialogTitleDirective,HlmDialogDescriptionDirective, HlmLabelDirective, HlmInputDirective, HlmButtonDirective,
  SignalInputDirective, BrnSelectImports, HlmSelectImports, FormsModule, BrnCommandImports, HlmCommandImports, HlmIconComponent,
  HlmButtonDirective, BrnPopoverComponent, BrnPopoverTriggerDirective, BrnPopoverTriggerDirective, BrnPopoverContentDirective,
  NgForOf, BrnMenuTriggerDirective, HlmMenuModule, BrnTableModule, HlmTableModule,HlmButtonModule, DecimalPipe, TitleCasePipe, HlmIconComponent,
  HlmInputDirective, HlmCheckboxCheckIconComponent, HlmCheckboxComponent, BrnSelectModule, HlmSelectModule, CommonModule
],
  templateUrl: './espacios.component.html',
  styleUrl: './espacios.component.css'
})
export class EspaciosComponent implements OnInit{

  isLoading = signal(false);

  public state = signal<'closed' | 'open'>('closed');
  public states = signal<'closed' | 'open'>('closed');
  espacios : Espacio[] = [];

  protected formModel = createFormGroup({
    name: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El nombre es requerido'
        }
      ]
    }),
    canPersonas: createFormField(0, {
      validators: [
        {
          validator: V.required(),
          message: 'La cantidad de personas es necesaria'
        }
      ]
    }),
    precio: createFormField(0, {
      validators: [
        {
          validator: V.required(),
          message: 'El precio es necesario'
        }
      ]
    }),
    descrip: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La descripcion es necesaria'
        }
      ]
    }),
    
    id: createFormField(0,{
      hidden: () => true
    }),
  });


  constructor(private espacioService : EspacioSerService) {

    effect(() => this._nameFilter.set(this._debouncedFilter() ?? '' ),{allowSignalWrites: true});
    this.espacioService.getPlaces().subscribe({
      next: (spaces) => {
        this._spaces.set(spaces);
      },
      error: (error) => {
        console.error('Error al obtener los espacios', error);
      }
    });

   }


  onAddUser(newEspacio: Espacio) {
    this.espacioService.addPlace(newEspacio).subscribe({
      next: (space) => {
        console.log('Usuario creado correctamente', space);
        toast.success('Usuario creado correctamente');
        this.formModel.reset();
      },
      error: (error) => {
        console.error('Error al crear el usuario', error);
        toast.error('Error al crear el usuario');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    })
  }


  
  onSubmit() {
    if(this.formModel.valid()) {
      const newEspacio: Espacio = {
        idEspacio: 0, // Asumimos que es un nuevo espacio, por lo que el ID es 0 o se autogenerará en la base de datos
        nombre: this.formModel.controls.name.value(),
        canPersonas: this.formModel.controls.canPersonas.value(),
        precio: this.formModel.controls.precio.value(),
        estatus: 'Activo', // Valor por defecto para nuevos espacios
        descripcion: this.formModel.controls.descrip.value(),
      };
    
      this.isLoading.set(true);
      this.onAddUser(newEspacio);
    } else {
      this.formModel.markAllAsTouched();
      toast.error('Por favor, llena todos los campos');
    }
  }
  

  protected readonly _rawFilterInput = signal('');
  protected readonly _nameFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });

  private readonly _selectionModel = new SelectionModel<Espacio>(true);
  protected readonly _isSpaceSelected = (space: Espacio) => this._selectionModel.isSelected(space);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(() => this._selectionModel.selected)),{
      initialValue: []
    }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    Name: {visible: true, label: 'Nombre', sortable: true},
    Cantidad: {visible: true, label: 'Cantidad', sortable: true},
    Precio: {visible: true, label: 'Precio', sortable: true},
    Descripcion: {visible: true, label: 'Descripcion', sortable: true},
  });


  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _spaces = signal<Espacio[]>([]);

  private readonly _filteredUsers = computed(() => {
    const nameFilter = this._nameFilter()?.trim()?.toLowerCase();
    if (nameFilter && nameFilter.length > 0) {
      return this._spaces().filter((u) => u.nombre.toLowerCase().includes(nameFilter));
    }
    return this._spaces();
  });

  private readonly _nameSort = signal<'ASC' | 'DESC' | null>(null);

  protected readonly _filteredSortedPaginatedSpaces = computed(() => {
    const sort = this._nameSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredUsers();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.nombre.localeCompare(p2.nombre))
      .slice(start, end);
  });

  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._nameSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredUsers();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.nombre.localeCompare(p2.nombre))
      .slice(start, end);
  });

  protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
    this._filteredSortedPaginatedPayments().every((payment) => this._selected().includes(payment)),
  );

  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });


  protected readonly _trackBy: TrackByFunction<Espacio> = (_: number, p: Espacio) => p.idEspacio;
  protected readonly _totalElements = computed(() => this._filteredUsers().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });


  protected toggleSpace(payment: Espacio) {
    this._selectionModel.toggle(payment);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedPayments());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
    }
  }


  ngOnInit(): void {
    this.getEspacios();
  }

  getEspacios(): void{
    this.espacioService.getPlaces()
    .subscribe(espacios => this.espacios = espacios);
  }

  isEditing = signal(false);

  onClickEdit(espa: Espacio) {
    this.isEditing.set(true);
    this.formModel.controls.name.value.set(espa.nombre);
    this.formModel.controls.canPersonas.value.set(espa.canPersonas);
    this.formModel.controls.precio.value.set(espa.precio);
    this.formModel.controls.descrip.value.set(espa.descripcion);
    this.formModel.controls.id.value.set(Number(espa.idEspacio));

    this.states.set('open');
  }
  onCancel() {
    this.isEditing.set(false);
    this.states.set('closed');
    this.formModel.reset();
  }

  

}
