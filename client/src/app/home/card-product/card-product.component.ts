import { NgClass } from '@angular/common';
import { Component,input, computed } from '@angular/core';

@Component({
  selector: 'card-product',
  standalone: true,
  imports: [
    NgClass
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



}
