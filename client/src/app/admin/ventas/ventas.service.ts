import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '~/lib/endpoint';
import { Observable } from 'rxjs';
import { Order } from './interface/order';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  apiURL = ENDPOINTS.ventas;

  constructor(private http: HttpClient) { }

  getOrders = (): Observable<Order[]> =>
    this.http.get<Order[]>(`${this.apiURL}/allOrders`)
}
