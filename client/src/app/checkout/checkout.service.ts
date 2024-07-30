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
      localStorage.setItem('selectedCard', JSON.stringify(this.selectedCard()));
    });

    effect(() => {
      localStorage.setItem('selectedAddress', JSON.stringify(this.selectdAddress()));
    });

    effect(() => {
      localStorage.setItem('isOrderToStore', JSON.stringify(this.isOrderToStore()));
    })

    effect(() => {
      localStorage.setItem('isPaidWithCard', JSON.stringify(this.isPaidWithCard()));
    })
  }


  

  url = 'https://localhost:7268/Orders';
  urlAddress = 'https://localhost:7268/api/Direcciones';
  urlCard = 'https://localhost:7268/api/CreditCards';

  orderSignal = signal<Order>(this.loadOrderFromLocalStorage());

  isOrderToStore = signal(false);
  isPaidWithCard = signal(false);

  selectdAddress = signal<Address>({} as Address);

  selectedCard = signal<CreditCard>({} as CreditCard);



  setOrder(order: Order) {
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

  private loadOrderFromLocalStorage(): Order {
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
