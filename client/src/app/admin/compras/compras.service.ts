import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '~/lib/endpoint';
import { Observable } from 'rxjs';
import { Compra } from './interface/compras';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  apiURL = ENDPOINTS.compras;

  constructor(private http: HttpClient) { }

  getCompras = (): Observable<Compra[]> =>
    this.http.get<Compra[]>(`${this.apiURL}/allCompras`)

  getCompraById = (id: number): Observable<Compra> =>
    this.http.get<Compra>(`${this.apiURL}/getCompra/${id}`)

  createCompra = (compra: Compra): Observable<Compra> =>
    this.http.post<Compra>(`${this.apiURL}/addCompra`, compra)
}
