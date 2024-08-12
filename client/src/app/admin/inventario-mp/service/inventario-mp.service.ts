import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { InventarioMP } from '../interface/inventarioMP';

@Injectable({
  providedIn: 'root'
})

export class InventarioMPService {

  apiURL = ENDPOINTS.inventarioMP;

  constructor(private http: HttpClient) {}

  getInventarios = (): Observable<InventarioMP[]> =>
    this.http.get<InventarioMP[]>(`${this.apiURL}`);
  
  registrarInventario(data: InventarioMP): Observable<InventarioMP> {
    return this.http.post<InventarioMP>(this.apiURL, data);
  }

  editarInventario(id: number, data: InventarioMP): Observable<InventarioMP> {
    return this.http.put<InventarioMP>(`${this.apiURL}/${id}`, data);
  }

  eliminarInventario(id: number): Observable<void> {
    return this.http.get<InventarioMP>(`${this.apiURL}/${id}`).pipe(
      switchMap(inventario => {
        inventario.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, inventario);
      })
    );
  }
}