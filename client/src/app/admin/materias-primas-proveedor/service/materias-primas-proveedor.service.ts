import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MateriaPrimaProveedor } from '../interface/materiaPrimaProveedor';
import { ENDPOINTS } from '~/lib/endpoint';

@Injectable({
  providedIn: 'root'
})
export class MateriasPrimasProveedorService {

  apiURL = ENDPOINTS.materiaPrimaProveedor;

  constructor(private http: HttpClient) {}

  getMateriasPrimasProveedor = (): Observable<MateriaPrimaProveedor[]> =>
    this.http.get<MateriaPrimaProveedor[]>(`${this.apiURL}`);

  registrarMateriaPrimaProveedor(data: MateriaPrimaProveedor): Observable<MateriaPrimaProveedor> {
    return this.http.post<MateriaPrimaProveedor>(this.apiURL, data);
  }

  editarMateriaPrimaProveedor(id: number, data: MateriaPrimaProveedor): Observable<MateriaPrimaProveedor> {
    return this.http.put<MateriaPrimaProveedor>(`${this.apiURL}/${id}`, data);
  }

  eliminarMateriaPrimaProveedor(id: number): Observable<void> {
    return this.http.get<MateriaPrimaProveedor>(`${this.apiURL}/${id}`).pipe(
      switchMap(materiaPrimaProveedor => {
        materiaPrimaProveedor.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, materiaPrimaProveedor);
      })
    );
  }

  getMateriaPrimaProveedorById(id: number): Observable<MateriaPrimaProveedor> {
    return this.http.get<MateriaPrimaProveedor>(`${this.apiURL}/${id}`);
  }
}
