import { Component, inject } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';
import {
  HlmDialogComponent, HlmDialogContentComponent, HlmDialogHeaderComponent, HlmDialogFooterComponent,
  HlmDialogTitleDirective, HlmDialogDescriptionDirective,
} from '~/components/ui-dialog-helm/src';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { BrnDialogTriggerDirective, BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { from, map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { InventarioPostre } from './interface/InventarioPostres';
import { InventarioPostresService } from './service/inventario-postres.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-inventario-postres',
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
  templateUrl: './inventario-postres.component.html',
  styleUrls: ['./inventario-postres.component.css']
})
export class InventarioPostresComponent {
  inventarioPostresService = inject(InventarioPostresService);
  inventarios$: Observable<InventarioPostre[]>;
  inventario: InventarioPostre = {};
  editMode: boolean = false;

  constructor() {
    this.inventarios$ = this.inventarioPostresService.getInventarios().pipe(
      map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
    );
  }

  trackByInventarioId(index: number, inventario: any): number {
    return inventario.idPostre!;
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.inventario.estatus = 1;
      this.inventario.createdAt = new Date().toISOString();
      this.inventarioPostresService.registrarInventario(this.inventario).subscribe(response => {
        console.log('Inventario registrado:', response);
        form.resetForm();
        this.inventario = {}; // Reiniciar el objeto inventario
        this.refreshInventarios();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.inventarioPostresService.editarInventario(this.inventario.idPostre!, this.inventario).subscribe(response => {
        console.log('Inventario actualizado:', response);
        form.resetForm();
        this.inventario = {}; // Reiniciar el objeto inventario
        this.editMode = false;
        this.refreshInventarios();
      });
    }
  }

  onAdd() {
    this.inventario = {}; // Limpiar el objeto inventario antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-inventario-trigger');
    addButton?.click();
  }

  onEdit(inventario: InventarioPostre) {
    this.inventario = { ...inventario };
    this.editMode = true;
    const editButton = document.getElementById('edit-inventario-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.inventarioPostresService.eliminarInventario(id).subscribe(() => {
      console.log('Inventario eliminado');
      this.refreshInventarios();
    });
  }

  refreshInventarios() {
    this.inventarios$ = this.inventarioPostresService.getInventarios().pipe(
      map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
    );
  }
}
