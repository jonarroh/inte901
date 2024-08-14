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
import { BrnTableModule } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';

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
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
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
  materiasPrimas$: Observable<MateriaPrima[]>;
  materiaPrima: MateriaPrima = {};
  editMode: boolean = false;

  displayedColumns = ['ID', 'Nombre', 'actions'];

  constructor() {
    this.materiasPrimas$ = this.materiaService.getMateriaPrima().pipe(
      map((materiasPrimas) =>
        materiasPrimas.filter((materiaPrima) => materiaPrima.estatus === 1)
      )
    );
  }

  trackByMateriaPrimaId(index: number, materiaPrima: any): number {
    return materiaPrima.id;
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
