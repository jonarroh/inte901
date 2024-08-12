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
import { InventarioMP } from './interface/inventarioMP';
import { InventarioMPService } from './service/inventario-mp.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-inventario-mp',
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
  templateUrl: './inventario-mp.component.html',
  styleUrls: ['./inventario-mp.component.css']
})
export class InventarioMPComponent {
  inventarioMPService = inject(InventarioMPService);
  inventarios$: Observable<InventarioMP[]>;
  inventario: InventarioMP = {};
  editMode: boolean = false;

  constructor() {
    this.inventarios$ = this.inventarioMPService.getInventarios().pipe(
      map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
    );
  }

  trackByInventarioId(index: number, inventario: any): number {
    return inventario.id!;
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.inventario.estatus = 1;
      this.inventario.createdAt = new Date().toISOString();
      this.inventarioMPService.registrarInventario(this.inventario).subscribe(response => {
        console.log('Inventario registrado:', response);
        form.resetForm();
        this.inventario = {}; // Reiniciar el objeto inventario
        this.refreshInventarios();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.inventarioMPService.editarInventario(this.inventario.id!, this.inventario).subscribe(response => {
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

  onEdit(inventario: InventarioMP) {
    this.inventario = { ...inventario };
    this.editMode = true;
    const editButton = document.getElementById('edit-inventario-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.inventarioMPService.eliminarInventario(id).subscribe(() => {
      console.log('Inventario eliminado');
      this.refreshInventarios();
    });
  }

  refreshInventarios() {
    this.inventarios$ = this.inventarioMPService.getInventarios().pipe(
      map(inventarios => inventarios.filter(inventario => inventario.estatus === 1))
    );
  }
}