import { computed, Injectable, Signal, signal } from '@angular/core';
import { Producto } from '~/lib/types';

export interface ProductoWithQuantity extends Producto {
  quantity: number;
  discount?: number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'shoppingCart';

  cartSignal = signal<ProductoWithQuantity[]>(this.loadCartFromLocalStorage());

  total = computed(() => {
    return this.cartSignal().reduce((acc, item) => acc + (item.precio * item.quantity) - (item.discount ?? 0), 0);
  });


  openCart = signal(true);

  constructor() {
    window.addEventListener('storage', this.syncCartAcrossTabs.bind(this));
  }

  private syncCartAcrossTabs(event: StorageEvent): void {
    if (event.key === this.storageKey) {
      this.cartSignal.set(JSON.parse(event.newValue || '[]'));
    }
    
  }

 

  private loadCartFromLocalStorage(): ProductoWithQuantity[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
  private loadDiscountsFromLocalStorage(): number[] {
    return JSON.parse(localStorage.getItem('discounts') || '[]');
  }

  private saveCartToLocalStorage(items: ProductoWithQuantity[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    localStorage.setItem('cartlastupdate', Date.now().toString());
    this.cartSignal.set(items);
  }

  getItems(): ProductoWithQuantity[] {
    return this.cartSignal();
  }

  editItem(index: number, quantity: number): void {
    const cart = this.cartSignal();
    cart[index].quantity = quantity;
    this.saveCartToLocalStorage(cart);
  }

  getTotal(): Signal<number> {
    return this.total;
  }

  addItem(item: ProductoWithQuantity): void {
    const cart = this.cartSignal();
    const index = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (index !== -1) {
      cart[index].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.saveCartToLocalStorage(cart);
  }

  removeItem(index: number): void {
    const cart = this.cartSignal();
    cart.splice(index, 1);
    this.saveCartToLocalStorage(cart);
  }

  clearCart(): void {
    this.saveCartToLocalStorage([]);
  }

}
