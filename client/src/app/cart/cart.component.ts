import { Component, signal, Signal ,effect} from '@angular/core';
import { CartService, ProductoWithQuantity } from './cart.service';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective
} from '@spartan-ng/ui-sheet-helm';
import { LucideAngularModule } from 'lucide-angular';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    LucideAngularModule,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    BrnSheetContentDirective,
    BrnSheetTriggerDirective,
    HlmButtonDirective,
    CommonModule,
    FormsModule,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective


  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  items = this.cartService.cartSignal;
  

  get total(): number {
    return this.items().reduce((acc, item) => acc + item.precio * item.quantity, 0);
  }

  
  constructor(private cartService: CartService) {}


  increment(id: number): void {
    const itemIndex = this.items().findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const item = this.items()[itemIndex];
      this.cartService.editItem(itemIndex, item.quantity + 1);
    }
  }

  decrement(id: number): void {
    const itemIndex = this.items().findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      const item = this.items()[itemIndex];
      if (item.quantity > 1) {
        this.cartService.editItem(itemIndex, item.quantity - 1);
      } else {
        this.cartService.removeItem(itemIndex);
      }

    }
  }

  removeItem(id: number): void {
    const itemIndex = this.items().findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      this.cartService.removeItem(itemIndex);
    }
  }

  deleteAll(): void {
    this.cartService.clearCart();
  }

  trackById(index: number, item: ProductoWithQuantity): number {
    return item.id;
  }
}
