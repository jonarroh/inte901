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
import { Producto } from './interface/producto';
import { ProductoService } from './service/producto.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-productos',
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
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  productoService = inject(ProductoService);
  productos$: Observable<Producto[]>;
  producto: Producto = {};
  editMode: boolean = false;

  constructor() {
    this.productos$ = this.productoService.getProductos().pipe(
      map(productos => productos.filter(producto => producto.estatus === 1))
    );
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.producto.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.producto.estatus = 1;
      this.producto.createdAt = new Date().toISOString();
      this.productoService.registrarProductos(this.producto).subscribe(response => {
        console.log('Producto registrado:', response);
        form.resetForm();
        this.producto = {}; // Reiniciar el objeto producto
        this.refreshProductos();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.productoService.editarProducto(this.producto.id!, this.producto).subscribe(response => {
        console.log('Producto actualizado:', response);
        form.resetForm();
        this.producto = {}; // Reiniciar el objeto producto
        this.editMode = false;
        this.refreshProductos();
      });
    }
  }

  onAdd() {
    this.producto = {}; // Limpiar el objeto producto antes de abrir el formulario de agregar
    const addButton = document.getElementById('add-product-trigger');
    addButton?.click();
  }

  onEdit(product: Producto) {
    this.producto = { ...product };
    this.editMode = true;
    const editButton = document.getElementById('edit-product-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.productoService.eliminarProducto(id).subscribe(() => {
      console.log('Producto eliminado');
      this.refreshProductos();
    });
  }

  refreshProductos() {
    this.productos$ = this.productoService.getProductos().pipe(
      map(productos => productos.filter(producto => producto.estatus === 1))
    );
  }
}
