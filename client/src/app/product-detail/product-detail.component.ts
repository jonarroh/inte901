import { Component, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { ProductosService } from '../home/services/productos.service';

import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';


import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { Producto } from '~/lib/types';

import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NavbarComponent,
    HlmSkeletonComponent,
    HlmSeparatorDirective,
    BrnSeparatorComponent,
    HlmAccordionContentDirective,
    HlmAccordionDirective,
    HlmAccordionIconDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    BrnAccordionContentComponent,
    HlmIconComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  productoId: string | null = null;
  isLoading = true;
  product: Producto | null = null;
  img = computed(() => `http://localhost:5000/static/productos/${this.productoId}.webp`);
  fallbackUrl = 'http://localhost:5000/static/productos/fallback.webp';

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
          this.product = producto;
          console.log(this.product);
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackUrl;
  }
  

}
