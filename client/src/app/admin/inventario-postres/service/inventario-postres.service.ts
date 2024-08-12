import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { InventarioPostre } from '../interface/InventarioPostres';

@Injectable({
  providedIn: 'root'
})
export class InventarioPostresService {

  apiURL = ENDPOINTS.inventarioPostre;

  constructor(private http: HttpClient) {}

  getInventarios = (): Observable<InventarioPostre[]> =>
    this.http.get<InventarioPostre[]>(this.apiURL);

  registrarInventario(data: InventarioPostre): Observable<InventarioPostre> {
    return this.http.post<InventarioPostre>(this.apiURL, data);
  }

  editarInventario(id: number, data: InventarioPostre): Observable<InventarioPostre> {
    return this.http.put<InventarioPostre>(`${this.apiURL}/${id}`, data);
  }

  eliminarInventario(id: number): Observable<void> {
    return this.http.get<InventarioPostre>(`${this.apiURL}/${id}`).pipe(
      switchMap(inventario => {
        inventario.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, inventario);
      })
    );
  }
}
