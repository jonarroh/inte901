import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Proveedor } from '../interface/proveedor';
import { MateriaPrimaProveedor } from '../interface/materiaPrimaProveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  apiURLProveedores = ENDPOINTS.proveedor;
  apiURLMateriaPrimaProveedor = ENDPOINTS.materiaPrimaProveedor

  constructor(private http:HttpClient) {}

  getProveedores = (): Observable<Proveedor[]> =>
    this.http.get<Proveedor[]>(`${this.apiURLProveedores}`)
  
  registrarProveedor(data: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiURLProveedores, data);
  }

  editarProveedor(id: number, data: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiURLProveedores}/${id}`, data);
  }

  eliminarProveedor(id: number): Observable<void> {
    return this.http.get<Proveedor>(`${this.apiURLProveedores}/${id}`).pipe(
      switchMap(proveedor => {
        proveedor.estatus = 0;
        return this.http.put<void>(`${this.apiURLProveedores}/${id}`, proveedor);
      })
    );
  }

  getMateriasPrimasProveedores = (): Observable<MateriaPrimaProveedor[]> =>
    this.http.get<MateriaPrimaProveedor[]>(`${this.apiURLMateriaPrimaProveedor}`)
  
  registrarMateriaPrimaProveedor(data: MateriaPrimaProveedor): Observable<MateriaPrimaProveedor> {
    return this.http.post<MateriaPrimaProveedor>(this.apiURLMateriaPrimaProveedor, data);
  }

  editarMateriaPrimaProveedor(id: number, data: MateriaPrimaProveedor): Observable<MateriaPrimaProveedor> {
    return this.http.put<MateriaPrimaProveedor>(`${this.apiURLMateriaPrimaProveedor}/${id}`, data);
  }
}
