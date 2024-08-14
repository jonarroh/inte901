import { Component, inject, computed } from '@angular/core';
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
import { from, map, Observable, of } from 'rxjs';
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
  imagen: File | null = null;

  fallbackUrl = 'http://localhost:5000/static/productos/fallback.webp';

  constructor() {
    this.productos$ = this.productoService.getProductos().pipe(
      map(productos => productos.filter(producto => producto.estatus === 1))
    );
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  getImagenUrl(id: number): string {
    return `http://localhost:5000/static/productos/${id}.webp`;
  }

  onFileChange(event: any) {
    this.imagen = event.target.files[0];
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackUrl;
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.producto.estatus = 1;
      this.producto.createdAt = new Date().toISOString();
      this.productoService.registrarProductos(this.producto, this.imagen!).subscribe(response => {
        console.log('Producto registrado:', response);
        form.resetForm();
        this.imagen = null; // Reiniciar la imagen seleccionada
        this.producto = {}; // Reiniciar el objeto producto
        this.refreshProductos();
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      // Si no hay una imagen seleccionada, pasamos undefined
      this.productoService.editarProducto(this.producto.id!, this.producto, this.imagen || undefined).subscribe(response => {
        console.log('Producto actualizado:', response);
        form.resetForm();
        this.imagen = null; // Reiniciar la imagen seleccionada
        this.producto = {}; // Reiniciar el objeto producto
        this.editMode = false;
        this.refreshProductos();
      });
    }
  }

  onAdd() {
    this.producto = {}; // Limpiar el objeto producto antes de abrir el formulario de agregar
    this.imagen = null; // Limpiar la imagen seleccionada
    const addButton = document.getElementById('add-product-trigger');
    addButton?.click();
  }

  onEdit(product: Producto) {
    this.producto = { ...product };
    this.editMode = true;
    this.imagen = null; // Limpiar la imagen seleccionada para edición
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