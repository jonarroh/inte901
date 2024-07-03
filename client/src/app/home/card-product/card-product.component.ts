import { NgClass } from '@angular/common';
import { Component,input, computed } from '@angular/core';

import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

type FilterProduct = 'All' | 'Postre' | 'Bebida';

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [
    NgClass,
    HlmBadgeDirective
  ],
  templateUrl: './card-product.component.html'
})
export class CardProductComponent {

  
  imageUrl = computed(() => `http://localhost:5000/static/productos/${this.id()}.webp`);
  title = input.required<string>();
  description = input.required<string>();
  price = input.required<number>();
  category = input.required<string>();
  id = input.required<number>();

  canSee: FilterProduct = 'All';



}
