import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Espacio, Order } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private storageKey = 'Checkout-Order';
  constructor(private http: HttpClient) {
    window.addEventListener('storage', this.syncOrderAcrossTabs.bind(this));
  }

  url = 'https://localhost:7268/Orders';

  orderSignal = signal<Order | Espacio>(this.loadOrderFromLocalStorage());

  setOrder(order: Order | Espacio) {
    this.orderSignal.set(order);
    localStorage.setItem(this.storageKey, JSON.stringify(order));
  }

  private syncOrderAcrossTabs(event: StorageEvent): void {
    if (event.key === this.storageKey) {
      const newOrder = event.newValue ? JSON.parse(event.newValue) : null;
      if (newOrder) {
        this.orderSignal.set(newOrder);
      }
    }
  }

  private loadOrderFromLocalStorage(): Order | Espacio {
    const savedOrder = localStorage.getItem(this.storageKey);
    return savedOrder ? JSON.parse(savedOrder) : null;
  }

  getOrders() {
    return this.http.get<Order[]>(`${this.url}/allOrders`);
  }


  postOrder(order: Order) {
    return this.http.post<Order>(`${this.url}/addOrder`, order);
  }



}
