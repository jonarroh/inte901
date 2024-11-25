import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductosService } from './services/productos.service';
import { Producto } from '~/lib/types';
import { CardProductComponent } from './card-product/card-product.component';

import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { SearchComponent } from './search/search.component';
import { RouterModule } from '@angular/router';
import { ChatbotComponent } from '~/components/chatbot/chatbot.component';
import { PromocionesComponent } from '../promociones/promociones.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    CardProductComponent,
    HlmSkeletonComponent,
    SearchComponent,
    RouterModule,
    ChatbotComponent,
    PromocionesComponent,
    CommonModule,
  ],
  providers: [ProductosService],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  protected productos: Producto[] = [];
  protected topProductos: Producto[] = [];
  isLoading = signal(true);

  constructor(
    private productService: ProductosService,
    private http: HttpClient
  ) {}

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
        this.productos = productos;
      },
    });

    this.productService.getTopSellingProductos().subscribe({
      next: (topProductos) => {
        this.topProductos = topProductos;
      },
      error: (error) => {
        console.error('Error al cargar los productos más vendidos', error);
      },
    });
  }

  isLogged() {
    return !!localStorage.getItem('token');
  }
}
