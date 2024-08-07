import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '~/lib/endpoint';
import { Observable } from 'rxjs';
import { Order } from './interface/order';
import { DetailOrder } from './interface/detailorder';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  apiURL = ENDPOINTS.ventas;

  constructor(private http: HttpClient) { }

  getOrders = (): Observable<Order[]> =>
    this.http.get<Order[]>(`${this.apiURL}/allOrders`)

  getOrderDetail = (id: number): Observable<DetailOrder[]> =>
    this.http.get<DetailOrder[]>(`${this.apiURL}/orderDetail/${id}`)

  getOrder = (ticket: number, id: number): Observable<Order> =>
    this.http.get<Order>(`${this.apiURL}/oneOrder/${ticket},${id}`)

  addOrder = (order: Order): Observable<Order> =>
    this.http.post<Order>(`${this.apiURL}/addOrder`, order)
}
