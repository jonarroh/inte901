import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { InventarioMP } from '../interface/inventarioMP';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventarioMPService {

  apiURL = ENDPOINTS.inventarioMP;

  constructor(private http: HttpClient) {}

  getInventarioMP = (): Observable<InventarioMP[]> =>
    this.http.get<InventarioMP[]>(`${this.apiURL}`)

  registrarInventarioMP(data: InventarioMP): Observable<InventarioMP> {
    return this.http.post<InventarioMP>(this.apiURL, data);
  }

  editarInventarioMP(id: number, data: InventarioMP): Observable<InventarioMP> {
    return this.http.put<InventarioMP>(`${this.apiURL}/${id}`, data);
  }

  eliminarInventarioMP(id: number): Observable<void> {
    return this.http.get<InventarioMP>(`${this.apiURL}/${id}`).pipe(
      switchMap(inventarioMP => {
        inventarioMP.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, inventarioMP);
      })
    );
  }

  getInventarioMPById(id: number): Observable<InventarioMP> {
    return this.http.get<InventarioMP>(`${this.apiURL}/${id}`);
  }
}
