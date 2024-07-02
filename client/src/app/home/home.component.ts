import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductosService } from './services/productos.service';
import { Producto } from '~/lib/types';
import { CardProductComponent } from './card-product/card-product.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,CardProductComponent
  ],
  providers: [ProductosService],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  protected productos: Producto[] = [];

  constructor(private productService: ProductosService) {
    
   }

  ngOnInit() {
    this.productos = this.productService.getProductos();
    console.log(this.productos);
    }



  isLogged() {
    return !!localStorage.getItem('token');
  }



}
