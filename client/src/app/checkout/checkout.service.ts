import { HttpClient } from '@angular/common/http';
import { Injectable, signal, effect } from '@angular/core';
import { Address, CreditCard, Order } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private storageKey = 'Checkout-Order';
  private selectedCardKey = 'selectedCard';
  private selectedAddressKey = 'selectedAddress';
  private isOrderToStoreKey = 'isOrderToStore';
  private isPaidWithCardKey = 'isPaidWithCard';

  constructor(private http: HttpClient) {
    window.addEventListener('storage', this.syncOrderAcrossTabs.bind(this));

    // Initialize signals with localStorage values
    this.orderSignal = signal<Order>(this.loadOrderFromLocalStorage());
    this.selectedCard = signal<CreditCard>(this.loadFromLocalStorage(this.selectedCardKey, {} as CreditCard));
    this.selectedAddress = signal<Address>(this.loadFromLocalStorage(this.selectedAddressKey, {} as Address));
    this.isOrderToStore = signal<boolean>(this.loadFromLocalStorage(this.isOrderToStoreKey, false));
    this.isPaidWithCard = signal<boolean>(this.loadFromLocalStorage(this.isPaidWithCardKey, false));

    // Effects to update localStorage when signals change
    effect(() => {
      localStorage.setItem(this.selectedCardKey, JSON.stringify(this.selectedCard()));
    });

    effect(() => {
      localStorage.setItem(this.selectedAddressKey, JSON.stringify(this.selectedAddress()));
    });

    effect(() => {
      localStorage.setItem(this.isOrderToStoreKey, JSON.stringify(this.isOrderToStore()));
    });

    effect(() => {
      localStorage.setItem(this.isPaidWithCardKey, JSON.stringify(this.isPaidWithCard()));
    });
  }

  url = 'https://localhost:7268/api/Orders';
  urlAddress = 'https://localhost:7268/api/Direcciones';
  urlCard = 'https://localhost:7268/api/CreditCards';

  orderSignal = signal<Order>(this.loadOrderFromLocalStorage());
  isOrderToStore = signal<boolean>(false);
  isPaidWithCard = signal<boolean>(false);
  selectedAddress = signal<Address>({} as Address);
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

  private loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : defaultValue;
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
