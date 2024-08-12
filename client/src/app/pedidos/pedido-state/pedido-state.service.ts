import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoStateService {
  private readonly ORDER_ID_KEY = 'orderId';
  private readonly PRODUCT_IDS_KEY = 'productIds';
  private readonly ORDER_STATUS_KEY = 'orderStatus';

  private orderIdSubject = new BehaviorSubject<number | null>(parseInt(localStorage.getItem(this.ORDER_ID_KEY) || '0', 10));
  private orderStatusSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.ORDER_STATUS_KEY));
  private productIdsSubject = new BehaviorSubject<number[]>(JSON.parse(localStorage.getItem(this.PRODUCT_IDS_KEY) || '[]'));

  productIds$: Observable<number[]> = this.productIdsSubject.asObservable();
  orderStatus$: Observable<string | null> = this.orderStatusSubject.asObservable();


  setOrderId(orderId: number): void {
    localStorage.setItem(this.ORDER_ID_KEY, orderId.toString());
    this.orderIdSubject.next(orderId);
  }

  getOrderId(): Observable<number | null> {
    return this.orderIdSubject.asObservable();
  }

  setOrderStatus(status: string): void {
    localStorage.setItem(this.ORDER_STATUS_KEY, status);
    this.orderStatusSubject.next(status);
  }

  getOrderStatus(): Observable<string | null> {
    return this.orderStatusSubject.asObservable();
  }

  setProductIds(ids: number[]): void {
    localStorage.setItem(this.PRODUCT_IDS_KEY, JSON.stringify(ids));
    this.productIdsSubject.next(ids);
  }

  getProductIds(): Observable<number[]> {
    return this.productIdsSubject.asObservable();
  }
}