import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '~/lib/types';

@Injectable({
  providedIn: 'root',
})
export class PedidosUserServiceService {
  private apiUrl = 'http://localhost:5275/api/Orders';

  constructor(private http: HttpClient) {}

  getOrdersByUser(userId: number): Observable<any> {
    // Ajustar el endpoint según lo que indica Swagger
    return this.http.get<any>(`${this.apiUrl}/ordersByUser/${userId}`);
  }
}
