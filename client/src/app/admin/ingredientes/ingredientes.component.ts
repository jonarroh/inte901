import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { IngredienteService } from './service/ingrediente.service';
import { ProductoService } from '../productos/service/producto.service';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Ingrediente } from './interface/ingrediente';
import { Producto } from '../productos/interface/producto';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
import { FormBuilder, FormsModule, NgForm } from '@angular/forms';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '~/components/ui-dialog-helm/src';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import {
  BrnColumnManager,
  BrnTableModule,
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import {
  HlmSelectContentDirective,
  HlmSelectOptionComponent,
  HlmSelectTriggerComponent,
  HlmSelectValueDirective,
} from '~/components/ui-select-helm/src';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import {
  BrnAlertDialogContentDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '~/components/ui-alertdialog-helm/src';
import { CarTaxiFront, LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { FormGroup } from 'ng-signal-forms';

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
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,
    LucideAngularModule,
  ],
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.css'],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
    }),
  ],
})
export class IngredientesComponent implements OnInit {
  productos$!: Observable<Producto[]>; // Observable de productos
  materiasPrimas$!: Observable<MateriaPrima[]>; // Observable de materias primas
  ingredientes$!: Observable<Ingrediente[]>;
  ingrediente: Ingrediente = {
    idProducto: undefined,
    idMateriaPrima: undefined,
    cantidad: undefined,
    unidadMedida: '',
  };
  selectedProductId: number | null = null;
  pageIndex = 0;
  pageSize = 5;
  totalIngredientes = 0;

  private selectedProductIdSubject = new BehaviorSubject<number | null>(null);
  private ingredientesSubject = new BehaviorSubject<Ingrediente[]>([]);
  // Definir las columnas a mostrar
  allColumns = [
    { name: 'ID', label: 'ID', visible: true },
    { name: 'material', label: 'Material', visible: true },
    { name: 'cantidad', label: 'Cantidad', visible: true },
    { name: 'unidadMedida', label: 'Unidad de Medida', visible: true },
    { name: 'acciones', label: 'Acciones', visible: true },
  ];

  displayedColumns: string[] = this.allColumns
    .filter((column) => column.visible)
    .map((column) => column.name);

  constructor(
    private ingredienteService: IngredienteService,
    private productoService: ProductoService,
    private materiasPrimasService: MateriasPrimasService
  ) {}

  ngOnInit(): void {
    // Cargar productos y materias primas al iniciar el componente
    this.productos$ = this.productoService.getProductos();
    this.materiasPrimas$ = this.materiasPrimasService.getMateriaPrima();
  }

  // Método para abrir el diálogo de agregar
  onAdd(): void {
    this.ingrediente = {
      idProducto: undefined,
      idMateriaPrima: undefined,
      cantidad: undefined,
      unidadMedida: '',
    };
  }

  // Método para alternar la visibilidad de una columna
  toggleColumnVisibility(columnName: string): void {
    const column = this.allColumns.find((col) => col.name === columnName);
    if (column) {
      column.visible = !column.visible;
      this.updateDisplayedColumns();
    }
  }

  // Actualizar las columnas a mostrar en la tabla
  private updateDisplayedColumns(): void {
    this.displayedColumns = this.allColumns
      .filter((column) => column.visible)
      .map((column) => column.name);
  }

  // Función para deshabilitar una columna (ejemplo)
  isColumnDisabled(columnName: string): boolean {
    // Aquí puedes implementar lógica para determinar si alguna columna debe estar deshabilitada
    return false; // O retornar true para columnas específicas
  }

  // Función para verificar si la columna es visible
  isColumnVisible(columnName: string): boolean {
    const column = this.allColumns.find((col) => col.name === columnName);
    return column ? column.visible : false;
  }

  // Método de trackBy para mejorar rendimiento en ngFor
  trackByColumnName(index: number, column: any): string {
    return column.name;
  }

  // Método para registrar un nuevo ingrediente
  onSubmitAdd(form: NgForm, ctx: any): void {
    if (form.valid) {
      this.ingredienteService.registrarIngrediente(this.ingrediente).subscribe({
        next: (res) => {
          console.log('Ingrediente agregado:', res);
          this.resetTable('add');
          toast.success('Ingrediente agregado con éxito'); // Muestra el toast de éxito
          form.resetForm();
          ctx.close();
        },
        error: (err) => console.error('Error al agregar ingrediente:', err),
      });
    }
  }

  // Método para editar un ingrediente existente
  onSubmitEdit(form: NgForm, ctx: any): void {
    if (form.valid && this.ingrediente.id) {
      this.ingredienteService
        .editarIngrediente(this.ingrediente.id, this.ingrediente)
        .subscribe({
          next: (res) => {
            console.log('Ingrediente actualizado:', res);
            this.resetTable('edit');
            toast.success('Ingrediente actualizado con éxito'); // Muestra el toast de éxito
            form.resetForm();
            ctx.close();
          },
          error: (err) =>
            console.error('Error al actualizar ingrediente:', err),
        });
    }
  }

  onProductSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const productId = selectElement.value ? Number(selectElement.value) : null;

    if (productId !== null) {
      this.selectedProductId = productId;
      this.pageIndex = 0; // Reinicia la paginación al cambiar de producto
      this.ingredientes$ = this.ingredienteService
        .getIngredientesByProducto(productId)
        .pipe(
          switchMap((ingredientes) =>
            this.materiasPrimas$.pipe(
              map((materiasPrimas) =>
                ingredientes.map((ingrediente) => ({
                  ...ingrediente,
                  material:
                    materiasPrimas.find(
                      (materia) => materia.id === ingrediente.idMateriaPrima
                    )?.material || 'Desconocido',
                }))
              )
            )
          ),
          map((ingredientes) => {
            this.ingredientesSubject.next(ingredientes);
            this.totalIngredientes = ingredientes.length;
            return this.paginate(ingredientes);
          })
        );
    }
  }

  paginate(ingredientes: Ingrediente[]): Ingrediente[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return ingredientes.slice(start, end);
  }

  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    const ingredientes = this.ingredientesSubject.getValue();
    this.ingredientes$ = new BehaviorSubject(
      this.paginate(ingredientes)
    ).asObservable();
  }

  onEdit(ingrediente: Ingrediente): void {
    this.ingrediente = { ...ingrediente }; // Copia el ingrediente para editarlo
    // Aquí podrías abrir el formulario de edición
    document.getElementById('edit-ingrediente-trigger')?.click();
  }

  onDelete(id: number): void {
    this.ingredienteService.eliminarIngrediente(id).subscribe({
      next: () => {
        console.log(`Ingrediente con ID ${id} eliminado`);
        this.resetTable('delete');
        toast.success('Ingrediente eliminado con éxito'); // Muestra el toast de éxito
      },
      error: (err) => console.error(`Error al eliminar ingrediente:`, err),
    });
  }

  private resetTable(operationType: 'add' | 'edit' | 'delete'): void {
    if (operationType === 'add') {
      // Vaciar la tabla y resetear la paginación completamente para añadir
      this.pageIndex = 0;
      this.totalIngredientes = 0;
      this.ingredientesSubject.next([]); // Vacía la lista de ingredientes
      this.ingredientes$ = this.ingredientesSubject.asObservable();
    } else if (operationType === 'edit' || operationType === 'delete') {
      // Llamar a onProductSelect para recargar los ingredientes del producto seleccionado
      if (this.selectedProductId !== null) {
        const customEvent = {
          target: { value: this.selectedProductId?.toString() || '' },
        } as unknown as Event;
        this.onProductSelect(customEvent);
      }
    }
  }
}
