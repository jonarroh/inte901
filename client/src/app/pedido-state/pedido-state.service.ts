import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoStateService {

  private productIdsSubject = new BehaviorSubject<number[]>([]);
  productIds$: Observable<number[]> = this.productIdsSubject.asObservable();

  setProductIds(ids: number[]): void {
    this.productIdsSubject.next(ids);
  }
}
