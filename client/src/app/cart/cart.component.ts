import { Component, signal, Signal ,effect, ViewChild} from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { MoneyComponent } from '~/components/money/money.component';
import { CheckoutService } from '../checkout/checkout.service';
import { th } from 'date-fns/locale';
import { toast } from 'ngx-sonner';
import { PushService } from '../push/push.service';


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
    BrnDialogContentDirective,
    RouterModule,
    MoneyComponent

  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  items = this.cartService.cartSignal;
  isOpen = this.cartService.openCart;
  isLoaded = signal(false);

  get total(): number {
    return this.items().reduce((acc, item) => acc + item.precio * item.quantity, 0);
  }

  constructor(private cartService: CartService, private pushService: PushService, private checkService: CheckoutService) {
  }



  increment(id: number): void {
    const itemIndex = this.items().findIndex(item => item.id === id);

    this.isLoaded.set(true);
    if (itemIndex !== -1) {
      const item = this.items()[itemIndex];

      this.checkService.cheackInventory({
        idProduct: item.id,
        quantity: item.quantity
      }).subscribe({
        error: (err) => {
         console.log(err.error.text);
         if(err.error.text === 'Inventario disponible.'){
          this.cartService.editItem(itemIndex, item.quantity + 1);
         }else{
          toast.error('No hay suficiente inventario');
         }
         this.isLoaded.set(false);
        }

      });
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
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

  /*updateCart(newCart: ProductoWithQuantity[]): void {
    const cartData = {
        value: newCart,
        timestamp: Date.now() // Guardamos el tiempo actual
    };
    localStorage.setItem('cart', JSON.stringify(cartData));
    this.cartSignal.set(newCart); // Actualiza la señal de carrito en tu aplicación Angular
}*/

}
