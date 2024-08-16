import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '~/lib/endpoint';
import { Observable } from 'rxjs';
import { Compra } from './interface/compras';
import { DetailPurchase } from './interface/detailcompras';
import { InventarioMP } from './interface/inventarioMP';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  apiURL = ENDPOINTS.compras;
  invApi = ENDPOINTS.inventarioMP;

  constructor(private http: HttpClient) { }

  getCompras = (): Observable<Compra[]> =>
    this.http.get<Compra[]>(`${this.apiURL}/allCompras`)

  addCompra = (compra: Compra): Observable<Compra> =>
    this.http.post<Compra>(`${this.apiURL}/addCompra`, compra)

  updateCompraStatus = (id: number, status: string): Observable<Compra> =>
    this.http.put<Compra>(`${this.apiURL}/updateStatusCompra/${id},${ status }`,{})

  updateDetalleStatus = (id: number, status: string): Observable<Compra> =>
    this.http.put<Compra>(`${this.apiURL}/updateStatusDetail/${id},${status}`, {})

  getDetailCompra = (id: number): Observable<DetailPurchase[]> =>
    this.http.get<DetailPurchase[]>(`${this.apiURL}/getDetails/${id}`)

  getInventarioType = (id: number): Observable<InventarioMP> =>
    this.http.get<InventarioMP>(`${this.invApi}/${id}`)
}
