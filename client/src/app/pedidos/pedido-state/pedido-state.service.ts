import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoStateService {
  private orderIdSubject = new BehaviorSubject<number | null>(null);
  private productIdsSubject = new BehaviorSubject<number[]>([]);
  private orderStatusSubject = new BehaviorSubject<string | null>(null);

  orderId$ = this.orderIdSubject.asObservable();
  productIds$ = this.productIdsSubject.asObservable();
  orderStatus$ = this.orderStatusSubject.asObservable();

  setOrderId(id: number): void {
    this.orderIdSubject.next(id);
  }

  setProductIds(ids: number[]): void {
    this.productIdsSubject.next(ids);
  }

  setOrderStatus(status: string): void {
    this.orderStatusSubject.next(status);
  }
}