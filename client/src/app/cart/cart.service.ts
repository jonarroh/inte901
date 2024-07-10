import { Injectable } from '@angular/core';
import { Producto } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'shoppingCart';

  constructor() {
    window.addEventListener('storage', this.syncCartAcrossTabs.bind(this));
  }

  private syncCartAcrossTabs(event: StorageEvent): void {
    if (event.key === this.storageKey) {
      this.cart = JSON.parse(event.newValue || '[]');
    }
  }

  private get cart(): Producto[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private set cart(items: Producto[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getItems(): Producto[] {
    return this.cart;
  }

  addItem(item: Producto): void {
    const cart = this.cart;
    cart.push(item);
    this.cart = cart;
  }

  removeItem(index: number): void {
    const cart = this.cart;
    cart.splice(index, 1);
    this.cart = cart;
  }

  clearCart(): void {
    this.cart = [];
  }
}
