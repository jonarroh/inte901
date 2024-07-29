import { Component, inject } from '@angular/core';
import { MateriasPrimasService } from './service/materias-primas.service';
import { map, Observable } from 'rxjs';
import { MateriaPrima } from './interface/materias-primas';
import { FormsModule, NgForm } from '@angular/forms';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '~/components/ui-dialog-helm/src';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';

@Component({
  selector: 'app-materias-primas',
  standalone: true,
  imports: [HlmDialogComponent, 
            HlmDialogContentComponent,
            HlmDialogHeaderComponent,
            HlmDialogFooterComponent,
            HlmButtonDirective,
            HlmInputDirective,
            HlmDialogTitleDirective,
            HlmDialogDescriptionDirective,
            BrnDialogTriggerDirective,
            BrnDialogContentDirective,
            FormsModule,
            CommonModule,
            AsyncPipe],
  templateUrl: './materias-primas.component.html',
  styleUrl: './materias-primas.component.css'
})
export class MateriasPrimasComponent {
  materiaService = inject(MateriasPrimasService);
  materiasPrimas$: Observable<MateriaPrima[]>;
  materiaPrima: MateriaPrima = {};
  editMode: boolean = false;

  constructor() {
    this.materiasPrimas$ = this.materiaService.getMateriaPrima().pipe(
      map(materiasPrimas => materiasPrimas.filter(materiaPrima => materiaPrima.estatus === 1))
    );
  }

  trackByMateriaPrimaId(index: number, materiaPrima: any): number {
    return materiaPrima.id;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.materiaPrima.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.materiaPrima.estatus = 1;
      this.materiaPrima.createdAt = new Date().toISOString();
      this.materiaPrima.updatedAt = new Date().toISOString()
      this.materiaPrima.deletedAt = new Date().toISOString()
      this.materiaService.registrarMateriaPrima(this.materiaPrima).subscribe(response => {
        console.log('Materia prima registrada:', response);
        form.resetForm();
        this.materiaPrima = {}; // Reiniciar el objeto producto
        this.refreshMateriaPrima();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.materiaPrima.updatedAt = new Date().toISOString();
      this.materiaService.editarMateriaPrima(this.materiaPrima.id!, this.materiaPrima).subscribe(response => {
        console.log('Materia prima actualizada:', response);
        form.resetForm();
        this.materiaPrima = {}; // Reiniciar el objeto producto
        this.editMode = false;
        this.refreshMateriaPrima();
      });
    }
  }

  onAdd() {
    this.materiaPrima = {}; // Limpiar el objeto producto antes de abrir el formulario de agregar
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
      map(materiasPrimas => materiasPrimas.filter(materiaPrima => materiaPrima.estatus === 1))
    );
  }
}
