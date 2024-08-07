import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Producto } from '../interface/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiURL = ENDPOINTS.producto;
  
  constructor(private http:HttpClient) {}

  getProductos = (): Observable<Producto[]> =>
    this.http.get<Producto[]>(`${this.apiURL}`)
  
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiURL}/${id}`);
  }

  registrarProductos(data: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiURL, data);
  }

  editarProducto(id: number, data: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiURL}/${id}`, data);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.get<Producto>(`${this.apiURL}/${id}`).pipe(
      switchMap(producto => {
        producto.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, producto);
      })
    );
  }

 

}
