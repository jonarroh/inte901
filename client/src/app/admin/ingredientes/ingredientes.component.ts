import { Component, inject } from '@angular/core';
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
import { from, map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Ingrediente } from './interface/ingrediente';
import { IngredienteService } from './service/ingrediente.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnTableModule } from '@spartan-ng/ui-table-brain';
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
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
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

  displayedColumns = ['ID', 'Producto', 'Materia Prima', 'Cantidad', 'Unidad de Medida', 'actions'];

  constructor() {
    this.ingredientes$ = this.ingredienteService.getIngredientes().pipe(
      map((ingredientes) =>
        ingredientes.filter((ingrediente) => ingrediente.estatus === 1)
      )
    );

    // Obtener productos y materias primas
    this.productos$ = this.productoService.getProductos().pipe(
      map((productos) =>
        productos.filter((producto) => producto.estatus === 1)
      )
    );

    this.materiasPrimas$ = this.materiaPrimaService.getMateriaPrima().pipe(
      map((materiasPrimas) =>
        materiasPrimas.filter((materiaPrima) => materiaPrima.estatus === 1)
      )
    );
  }


  trackByIngredientId(index: number, ingredient: any): number {
    return ingredient.id!;
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
