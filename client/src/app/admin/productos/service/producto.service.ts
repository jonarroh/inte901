import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Producto } from '../interface/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiURL = ENDPOINTS.producto;
  
  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiURL}`);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiURL}/${id}`);
  }

  registrarProductos(data: Producto, imagen: File): Observable<Producto> {
    const formData = new FormData();
    formData.append('nombre', data.nombre || '');
    formData.append('precio', data.precio?.toString() || '');
    formData.append('descripcion', data.descripcion || '');
    formData.append('estatus', data.estatus?.toString() || '1');
    formData.append('tipo', data.tipo || '');
    formData.append('cantidadXReceta', data.cantidadXReceta?.toString() || '');
    formData.append('temperatura', data.temperatura || '');
    formData.append('createdAt', data.createdAt || new Date().toISOString());
    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.post<Producto>(this.apiURL, formData);
  }

  editarProducto(id: number, data: Producto, imagen?: File): Observable<Producto> {
    const formData = new FormData();
    formData.append('nombre', data.nombre || '');
    formData.append('precio', data.precio?.toString() || '');
    formData.append('descripcion', data.descripcion || '');
    formData.append('estatus', data.estatus?.toString() || '1');
    formData.append('tipo', data.tipo || '');
    formData.append('cantidadXReceta', data.cantidadXReceta?.toString() || '');
    formData.append('temperatura', data.temperatura || '');
    formData.append('createdAt', data.createdAt || new Date().toISOString());
    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.put<Producto>(`${this.apiURL}/${id}`, formData);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.getProductoById(id).pipe(
      switchMap(producto => {
        // Cambiamos solo el estatus a 0
        producto.estatus = 0;
  
        return this.http.put<void>(`${this.apiURL}/${id}`, producto);
      })
    );
  }
}
