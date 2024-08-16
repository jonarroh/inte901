import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { InventarioPostre } from '../interface/InventarioPostres';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventarioPostresService {

  apiURL = ENDPOINTS.inventarioPostre;

  constructor(private http: HttpClient) {}

  getInventarioPostre = (): Observable<InventarioPostre[]> =>
    this.http.get<InventarioPostre[]>(`${this.apiURL}`)

  registrarInventarioPostre(data: InventarioPostre): Observable<InventarioPostre> {
    return this.http.post<InventarioPostre>(this.apiURL, data);
  }

  editarInventarioPostre(id: number, data: InventarioPostre): Observable<InventarioPostre> {
    return this.http.put<InventarioPostre>(`${this.apiURL}/${id}`, data);
  }

  eliminarInventarioPostre(id: number): Observable<void> {
    return this.http.get<InventarioPostre>(`${this.apiURL}/${id}`).pipe(
      switchMap(inventarioPostre => {
        inventarioPostre.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, inventarioPostre);
      })
    );
  }

  getInventarioPostreById(id: number): Observable<InventarioPostre> {
    return this.http.get<InventarioPostre>(`${this.apiURL}/${id}`);
  }
}
