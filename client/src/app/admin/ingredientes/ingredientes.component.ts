import { Component, inject } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';
import {
  HlmDialogComponent, HlmDialogContentComponent, HlmDialogHeaderComponent,
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
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmInputDirective,
    CommonModule,
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.css']
})
export class IngredientesComponent {
  ingredienteService = inject(IngredienteService);
  ingredientes$: Observable<Ingrediente[]>;
  ingrediente: Ingrediente = {};
  editMode: boolean = false;

  constructor() {
    this.ingredientes$ = this.ingredienteService.getIngredientes().pipe(
      map(ingredientes => ingredientes.filter(ingrediente => ingrediente.estatus === 1))
    );
  }

  trackByIngredientId(index: number, ingredient: any): number {
    return ingredient.id!;
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.ingrediente.estatus = 1;
      this.ingrediente.createdAt = new Date().toISOString();
      this.ingredienteService.registrarIngredientes(this.ingrediente).subscribe(response => {
        console.log('Ingrediente registrado:', response);
        form.resetForm();
        this.ingrediente = {}; // Reiniciar el objeto ingrediente
        this.refreshIngredientes();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.ingredienteService.editarIngrediente(this.ingrediente.id!, this.ingrediente).subscribe(response => {
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
      map(ingredientes => ingredientes.filter(ingrediente => ingrediente.estatus === 1))
    );
  }
}
