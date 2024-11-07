import { Component, computed, effect, OnInit, Signal, signal, TrackByFunction } from '@angular/core';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { EspacioDTO } from '~/lib/types';
import { EspacioSerService } from './espacio-ser.service';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '~/components/ui-dialog-helm/src';
import { LucideAngularModule } from 'lucide-angular';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { HlmLabelDirective } from '~/components/ui-label-helm/src';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { createFormField, createFormGroup, SignalInputDirective, V } from 'ng-signal-forms';
import { BrnSelectImports, BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { FormsModule,  } from '@angular/forms';
import { HlmCommandImports } from '~/components/ui-command-helm/src';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { CommonModule, DecimalPipe, NgFor, NgForOf, TitleCasePipe } from '@angular/common';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '~/components/ui-menu-helm/src';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '~/components/ui-table-helm/src';
import { HlmCheckboxCheckIconComponent, HlmCheckboxComponent } from '~/components/ui-checkbox-helm/src';
import { SelectionModel } from '@angular/cdk/collections';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [
  NavbarComponent, HlmDialogComponent, HlmDialogContentComponent, HlmDialogFooterComponent,
  LucideAngularModule, BrnDialogContentDirective, BrnDialogTriggerDirective, HlmDialogHeaderComponent,
  HlmDialogTitleDirective,HlmDialogDescriptionDirective, HlmLabelDirective, HlmInputDirective, HlmButtonDirective,
  SignalInputDirective, BrnSelectImports, HlmSelectImports, FormsModule,  HlmCommandImports, HlmIconComponent,
  HlmButtonDirective, BrnPopoverComponent, BrnPopoverTriggerDirective, BrnPopoverTriggerDirective, BrnPopoverContentDirective,
  NgForOf, BrnMenuTriggerDirective, HlmMenuModule, BrnTableModule, HlmTableModule,HlmButtonModule, DecimalPipe, TitleCasePipe, HlmIconComponent,
  HlmInputDirective, HlmCheckboxCheckIconComponent, HlmCheckboxComponent, BrnSelectModule, HlmSelectModule, CommonModule
],
  templateUrl: './espacios.component.html',
  styleUrl: './espacios.component.css'
})
export class EspaciosComponent {


 


  espacio = signal<EspacioDTO | null>(null);
  
  isLoading = signal(false);
  public state = signal<'closed' | 'open'>('closed');
  public states = signal<'closed' | 'open'>('closed');
  
  private espacioId: number | null = null;
  espacios = signal<EspacioDTO[]>([]);
  selectedFile: File | null = null;
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();
  filteredEspacio$: Observable<EspacioDTO[]>;
  editMode: boolean = false;
  imagen: any = null;
  private refreshSubject = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshSubject.asObservable();
  

  

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
          message: 'La descripción es necesaria'
        }
      ]
    }),
    
    id: createFormField(0,{
      hidden: () => true
    }),
  });
  
  constructor(private espacioService: EspacioSerService) {

    this.refresh$.subscribe(() => this.refreshEspacios());
    this.espacioService.getPlaces().subscribe({
      next: (spaces) => {
        console.log('Espacios recibidos:', spaces); // Verify the received data here
        this.espacios.set(spaces);
      },
      error: (error) => {
        console.error('Error al obtener los espacios', error);
      }
    });
  
    this.filteredEspacio$ = combineLatest([
      toObservable(this.espacios), // Convertimos la signal espacios a un observable
      this.filter$
    ]).pipe(
      map(([spaces, filterValue]) =>
        spaces.filter(space =>
          space.nombre?.toLowerCase().includes(filterValue.toLowerCase())
        )
      )
    );
  }


  ngOnInit() {
    this.refreshEspacios(); // Fetch initial data
  }

  refreshEspacios() {
    this.espacioService.getPlaces().subscribe({
      next: (spaces) => {
        this.espacios.set(spaces);
        console.log('Espacios actualizados:', spaces);
      },
      error: (error) => {
        console.error('Error al obtener los espacios', error);
      }
    });
  }

  applyFilter(filterValue: string) {
    this.filterSubject.next(filterValue);
  }

  applyFilterFromEvent(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.applyFilter(inputElement.value);
  }

  

  getImagenUrl(id: number): string {
      return `http://localhost:5000/static/places/${id}.webp`;
  }
  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    //img.src = this.fallbackUrl;
  }
  

  private filterSpaces(searchTerm: string): EspacioDTO[] {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return this._spaces().filter(space =>
      space.nombre.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
  
  onAdd(){
    this.editMode = false;
    this.refreshSubject.next();
    this.formModel.reset();
    this.state.set('open');
  }

  onAddUser(newEspacio: EspacioDTO) {
    const formData = new FormData();
    formData.append('nombre', newEspacio.nombre);
    formData.append('canPersonas', newEspacio.canPersonas.toString());
    formData.append('precio', newEspacio.precio.toString());
    formData.append('descripcion', newEspacio.descripcion);
    formData.append('estatus', newEspacio.estatus);
    
  
    // Asegúrate de que la imagen se maneje si está presente
  if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }
  
    this.isLoading.set(true);
  
    this.espacioService.addPlace(formData).subscribe({
      next: (space) => {
        console.log('Espacio creado correctamente', space);
        toast.success('Espacio creado correctamente');
        this.formModel.reset();
        this.selectedFile = null;
        this.refreshSubject.next();
        this.espacioService.getPlaces().subscribe({
          next: (spaces) => {
            this.espacios.set(spaces);
          },
          error: (error) => {
            console.error('Error al obtener los espacios', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al crear el espacio', error);
        toast.error('Error al crear el espacio');
      },
      complete: () => {
        this.isLoading.set(false);
        this.refreshSubject.next();
      }
    });
  }

  async onSubmit() {
    this.isLoading.set(true);
    if (this.formModel.valid()) {  
      const name = this.formModel.controls.name.value();
      const canPersonas = this.formModel.controls.canPersonas.value();
      const precio = this.formModel.controls.precio.value();
      const descripcion = this.formModel.controls.descrip.value();
      const id = this.editMode ? this.espacioId : this.formModel.controls.id.value(); 
  
      if (id === null) {
        console.error('ID del espacio no válido');
        return;
      }
  
      console.log("descripcion " + this.formModel.controls.descrip.value());
      console.log("id " + id); // Verifica que el ID se está obteniendo correctamente
  
      const formData = new FormData();
      formData.append('nombre', name);
      formData.append('canPersonas', canPersonas.toString());
      formData.append('precio', precio.toString());
      formData.append('descripcion', descripcion);
      formData.append('estatus', 'Activo');
      formData.append('id', id.toString()); // Convertir el id a cadena
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
  
      this.isLoading.set(true);
  
      if (this.editMode) {
        // Actualizar el espacio existente
        this.espacioService.updatePlace(id, formData).subscribe({
          
          
          next: (space) => {
            console.log('Espacio actualizado correctamente', space);
            toast.success('Espacio actualizado correctamente');
            this.refreshSubject.next();
            this.state.set('closed');

          },
          error: (error) => {
            console.error('Error al actualizar el espacio', error);
            console.log("id"+id)
            toast.error('Error al actualizar el espacio');
          },
          complete: () => {
            this.isLoading.set(false);
            this.refreshEspacios();
          }
        });
      } else {
        this.espacioService.addPlace(formData).subscribe({
          next: (space) => {
            console.log('Espacio creado correctamente', space);
            toast.success('Espacio creado correctamente');
            this.formModel.reset();
            this.selectedFile = null;
            this.refreshSubject.next();
            this.state.set('closed');
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al crear el espacio', error);
            toast.error('Error al crear el espacio');
            this.state.set('closed');
            this.resetForm();
          },
          complete: () => {
            this.isLoading.set(false);
            this.resetForm();
          }
        });
      }
    }
  }
  
  
  
  
  updateFilter(filterValue: string) {
    this.filterSubject.next(filterValue); // Actualiza el filtro cuando cambia el valor
  }

  trackByProductId(index: number, space: any): number {
    return space.idEspacio;
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _nameFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<EspacioDTO>(true);
  protected readonly _isSpaceSelected = (space: EspacioDTO) => this._selectionModel.isSelected(space);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(() => this._selectionModel.selected)),{
      initialValue: []
    }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    Nombre: {visible: true, label: 'nombre', sortable: true},
    canPersonas: {visible: true, label: 'Cantidad', sortable: true},
    precio: {visible: true, label: 'Precio', sortable: true},
    descripcion: {visible: true, label: 'Descripción', sortable: true},
  });


  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _spaces = signal<EspacioDTO[]>([]);

  private readonly _filteredUsers = computed(() => {
    const nameFilter = this._nameFilter()?.trim();
    if (!nameFilter) {
      return this._spaces();
    }
    return this.filterSpaces(nameFilter);
  });
  
  
  

  private readonly _nameSort = signal<'ASC' | 'DESC' | null>(null);

  protected readonly _filteredSortedPaginatedSpaces = computed(() => {
    const sort = this._nameSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const spaces = this._filteredUsers();
    
    console.log('Filtered Spaces:', spaces); // Verifica los datos antes de ordenar y paginar
    
    // Ordenar
    if (sort) {
      spaces.sort((a, b) => (sort === 'ASC' ? 1 : -1) * a.nombre.localeCompare(b.nombre));
    }
  
    // Paginación
    return spaces.slice(start, end);
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


  protected readonly _trackBy: TrackByFunction<EspacioDTO> = (_: number, p: EspacioDTO) => p.idEspacio;
  protected readonly _totalElements = computed(() => this._filteredUsers().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });


  protected toggleSpace(payment: EspacioDTO) {
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

  onDeletePlace(space: EspacioDTO) {
    this.espacioService.deletePlace(space.idEspacio ?? 0).subscribe({
      next: () => {
        console.log('Espacio eliminado correctamente');
        toast.success('Espacio eliminado correctamente');

        this._spaces.set(this._spaces().filter((u) => u.idEspacio!== space.idEspacio));
      },
      error: (error) => {
        console.error('Error al eliminar el espacio', error);
        toast.error('Error al eliminar el espacio');
  }
  });
  }

  onDelete(id: number) {
    this.espacioService.deletePlace(id).subscribe(() => {
      console.log('Espacio desactivado');
      toast.success('Espacio desactivado correctamente');
      this.refreshEspacios();
      
    });
  }
  onActivar(id: number) {
    this.espacioService.activarPlace(id).subscribe(() => {
      console.log('Espacio activado');
      toast.success('Espacio activado correctamente');
      this.refreshEspacios();
    });
  }
  isEditing = signal(false);
    onCancel(): void {
      this.refreshEspacios();
      this.selectedFile = null; // Limpiar la imagen seleccionada
      this.state.set('closed');
    }
    onEdit(space: EspacioDTO) {
      this.editMode = true; // Cambia a modo de edición
      this.isEditing.set(true);
    
      if (space.idEspacio !== undefined) {
        this.formModel.controls.id.value.set(space.idEspacio);
        this.formModel.controls.name.value.set(space.nombre);
        this.formModel.controls.canPersonas.value.set(space.canPersonas);
        this.formModel.controls.precio.value.set(space.precio);
        this.formModel.controls.descrip.value.set(space.descripcion);

      }

      
      this.espacioId = space.idEspacio ?? null; // Guarda el ID del espacio
      this.state.set('open'); // Abre el diálogo
    }
    
    private resetForm() {
      this.espacio.set(null);
      this.selectedFile = null;
      this.state.set('closed');
    }

    
}
