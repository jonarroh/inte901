import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductosService } from './services/productos.service';
import { Producto } from '~/lib/types';
import { CardProductComponent } from './card-product/card-product.component';

import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,CardProductComponent,HlmSkeletonComponent,BreadcrumbComponent
  ],
  providers: [ProductosService],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  protected productos: Producto[] = [];
  isLoading = signal(true);

  constructor(private productService: ProductosService) {
    
   }

  ngOnInit() {
     this.productService.getProductos().subscribe({
      complete: () => {
        console.log('Productos cargados correctamente');
        this.isLoading.update(() => false);
      },
      error: (error) => {
        console.error('Error al cargar los productos', error);
      },
      next: (productos) => {
        this.productos = productos
      }
     })
    }



  isLogged() {
    return !!localStorage.getItem('token');
  }



}
