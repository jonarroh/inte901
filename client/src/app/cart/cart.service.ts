import { Injectable } from '@angular/core';
import { Producto } from '~/lib/types';

export interface ProductoWithQuantity extends Producto {
  quantity: number;
}

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

  private get cart(): ProductoWithQuantity[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private set cart(items: ProductoWithQuantity[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getItems(): ProductoWithQuantity[] {
    return this.cart;
  }

  addItem(item: ProductoWithQuantity): void {
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
