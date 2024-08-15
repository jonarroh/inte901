import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Proveedor } from '../interface/proveedor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  apiURL = ENDPOINTS.proveedor;

  constructor(private http: HttpClient) {}

  getProveedores = (): Observable<Proveedor[]> =>
    this.http.get<Proveedor[]>(`${this.apiURL}`)

  registrarProveedor(data: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiURL, data);
  }

  editarProveedor(id: number, data: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiURL}/${id}`, data);
  }

  eliminarProveedor(id: number): Observable<void> {
    return this.http.get<Proveedor>(`${this.apiURL}/${id}`).pipe(
      switchMap(proveedor => {
        proveedor.estatus = 0;
        proveedor.deletedAt = new Date().toISOString();
        return this.http.put<void>(`${this.apiURL}/${id}`, proveedor);
      })
    );
  }

  getProveedorById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiURL}/${id}`);
  }
}
