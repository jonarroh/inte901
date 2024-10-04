import { NgClass } from '@angular/common';
import { Component,input, computed, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { MoneyComponent } from '~/components/money/money.component';

type FilterProduct = 'All' | 'Postre' | 'Bebida';

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [
    NgClass,
    HlmBadgeDirective,
    RouterModule,
    MoneyComponent
  ],
  providers: [Router],
  templateUrl: './card-product.component.html'
})
export class CardProductComponent {

  constructor(private router: Router) { }
  


  fallbackUrl = 'http://localhost:5000/static/productos/fallback.webp';
  imageUrl = computed(() => `http://localhost:5000/static/productos/${this.id()}.webp`);


  title = input.required<string>();
  description = input.required<string>();
  price = input.required<number>();
  category = input.required<string>();
  id = input.required<number>();

  canSee: FilterProduct = 'All';

  redirectoToDetail(id: Signal<number>) {
    this.router.navigate(['products', id()]);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackUrl;
  }
  
}
