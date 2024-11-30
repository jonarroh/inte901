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
import { BehaviorSubject, combineLatest, from, map, Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Producto } from './interface/producto';
import { ProductoService } from './service/producto.service';
import { FormsModule, NgForm } from '@angular/forms';
import { EspacioDTO } from '~/lib/types';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/ui-alertdialog-brain';
import { HlmAlertDialogActionButtonDirective, HlmAlertDialogCancelButtonDirective, HlmAlertDialogComponent, HlmAlertDialogContentComponent, HlmAlertDialogDescriptionDirective, HlmAlertDialogFooterComponent, HlmAlertDialogHeaderComponent, HlmAlertDialogOverlayDirective, HlmAlertDialogTitleDirective } from '~/components/ui-alertdialog-helm/src';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';

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
    FormsModule,
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
    LucideAngularModule
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
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();
  filteredProductos$: Observable<Producto[]>;


  fallbackUrl = 'http://191.101.1.86:5000/static/productos/fallback.webp';

  constructor() {
    this.productos$ = this.productoService.getProductos().pipe(
      map(productos => productos.filter(producto => producto.estatus === 1))
    );

    this.filteredProductos$ = combineLatest([
      this.productos$,
      this.filter$
    ]).pipe(
      map(([productos, filterValue]) =>
        productos.filter(producto =>
          producto.nombre?.toLowerCase().includes(filterValue.toLowerCase())
        )
      )
    );
  }


  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  applyFilter(filterValue: string) {
    this.filterSubject.next(filterValue);
  }

  applyFilterFromEvent(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.applyFilter(inputElement.value);
  }


  getImagenUrl(id: number): string {
    return `http://191.101.1.86:5000/static/productos/${id}.webp`;
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
      // this.productoService.registrarProductos(this.producto, this.imagen!).subscribe(response => {
      //   console.log('Producto registrado:', response);
      //   this.refreshProductos();
      // });
      this.productoService.registrarProductos(this.producto, this.imagen!).subscribe({
        next: response => {
          console.log('Producto registrado:', response);
          toast.success('Producto registrado', {
            duration: 1200,
            onAutoClose: ((toast => {
              location.reload();
            }))
          });
        },
        error: error => {
          console.error('Error al registrar producto:', error);
          toast.error('Error al registrar producto', {
            duration: 1200,
            onAutoClose: ((toast => {
              location.reload();
            }))
          });
        }
      });
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      // Si no hay una imagen seleccionada, pasamos undefined
      // this.productoService.editarProducto(this.producto.id!, this.producto, this.imagen || undefined).subscribe(response => {
      //   console.log('Producto actualizado:', response);
      //   this.refreshProductos();
      // });
      this.productoService.editarProducto(this.producto.id!, this.producto, this.imagen || undefined).subscribe({
        next: response => {
          console.log('Producto actualizado:', response);
          toast.success('Producto actualizado', {
            duration: 1200,
            onAutoClose: ((toast => {
              location.reload();
            }))
          });
        },
        error: error => {
          console.error('Error al actualizar producto:', error);
          toast.error('Error al actualizar producto', {
            duration: 1200,
            onAutoClose: ((toast => {
              location.reload();
            }))
          });
        }
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
    // this.productoService.eliminarProducto(id).subscribe(() => {
    //   console.log('Producto eliminado');
    //   this.refreshProductos();
    // });
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        console.log('Producto eliminado');
        toast.success('Producto eliminado', {
          duration: 1200,
          onAutoClose: ((toast => {
            location.reload();
          }))
        });
      },
      error: error => {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar producto', {
          duration: 1200,
          onAutoClose: ((toast => {
            location.reload();
          }))
        });
      }
    });
  }
}
