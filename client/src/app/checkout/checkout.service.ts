import { HttpClient } from '@angular/common/http';
import { Injectable, signal,effect } from '@angular/core';
import { Address, CreditCard, Espacio, Order } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private storageKey = 'Checkout-Order';
  constructor(private http: HttpClient) {
    window.addEventListener('storage', this.syncOrderAcrossTabs.bind(this));
    effect(() => {
      console.log('Order changed', this.selectedCard());
    });
  }


  

  url = 'https://localhost:7268/api/Orders';
  urlAddress = 'https://localhost:7268/api/Direcciones';
  urlCard = 'https://localhost:7268/api/CreditCards';

  orderSignal = signal<Order | Espacio>(this.loadOrderFromLocalStorage());

  isOrderToStore = signal(false);
  isPaidWithCard = signal(false);

  selectdAddress = signal<Address>({} as Address);

  selectedCard = signal<CreditCard>({} as CreditCard);



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


  deleteCard(id: number) {
    return this.http.delete<CreditCard>(`${this.urlCard}/${id}`);
  }

  deleteAddress(id: number) {
    return this.http.delete<Address>(`${this.urlAddress}/${id}`);
  }

  createAddress(address: Address) {
    return this.http.post<Address>(`${this.urlAddress}`, address);
  }

  createCard(card: CreditCard) {
    return this.http.post<CreditCard>(`${this.urlCard}`, card);
  }

  editAddress(address: Address) {
    return this.http.put<Address>(`${this.urlAddress}/${address.id}`, address);
  }

  editCard(card: CreditCard) {
    return this.http.put<CreditCard>(`${this.urlCard}/${card.id}`, card);
  }


}
