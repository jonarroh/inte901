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
import { FormsModule } from '@angular/forms';


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
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  productoService = inject(ProductoService);
  productos$: Observable<Producto[]>;
  producto: Producto = {};

  constructor() {
    this.productos$ = this.productoService.getProductos().pipe(
      map(productos => productos.filter(producto => producto.estatus === 1))
    );
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  onFileChange(event: any) {
    // Método para manejar el cambio de archivo, aunque no se usará por ahora
  }

  onSubmit() {
    // Enviar los datos del producto sin incluir la imagen
    this.productoService.registrarProductos(this.producto).subscribe(response => {
      // Manejar la respuesta
      console.log('Producto registrado:', response);
    });
  }
}

