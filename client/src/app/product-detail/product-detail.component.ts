import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { ProductosService } from '../home/services/productos.service';

import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NavbarComponent,
    HlmSkeletonComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  productoId: string | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute,private productoService: ProductosService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productoId = params['id'];
    });

    if(this.productoId) {
      this.productoService.getProducto(
        Number(this.productoId)
      ).subscribe({
        next: (producto) => {
          console.log(producto);
        },
        error: (error) => {
          console.error('Error al cargar el producto', error);
        },
        complete: () => {
          console.log('Producto cargado correctamente');
          this.isLoading = false;
        }
      });
    }
  }

}
