import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { ProductosService } from '../home/services/productos.service';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { Order, Producto } from '~/lib/types';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ContadorComponent } from './contador/contador.component';
import { CheckoutService } from '../checkout/checkout.service';
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';

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
    HlmIconComponent,
    ContadorComponent,
    BreadcrumbComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productoId: string | null = null;
  isLoading = signal(true);
  product: Producto = this.getEmptyProduct();
  img = computed(() => `http://localhost:5000/static/productos/grande/${this.productoId}.webp`);
  fallbackUrl = 'http://localhost:5000/static/productos/fallback.webp';

  constructor(private route: ActivatedRoute, 
              private productoService: ProductosService,
              private router: Router
            ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productoId = params['id'];
      if (this.productoId) {
        this.loadProduct(Number(this.productoId));
      }
    });
  }
  

  loadProduct(productId: number): void {
    this.productoService.getProducto(productId).subscribe({
      next: (producto) => {
        if (producto) {
          this.product = producto;
          this.isLoading.set(false);
        } else {
          this.handleProductNotFound();
        }
      },
      error: (error) => {
        console.error('Error al cargar el producto', error);
        this.handleProductNotFound();
      }
    });
  }

  handleProductNotFound(): void {
    this.router.navigate(['/products']);
  }

  getEmptyProduct(): Producto {
    return {
      id: 0,
      nombre: '',
      cantidadXReceta: 0,
      createdAt: new Date().toString(),
      descripcion: '',
      estatus: 1,
      ingredientes: [],
      inventarioPostres: [],
      precio: 0,
      tipo: 'Bebidas',
    };
  }



  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackUrl;
  }
}
