import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, TipoProducto } from '~/lib/types';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private http: HttpClient) {}

  endpoint = 'https://localhost:7268/api/Productos';

  private productos: Producto[] = [];

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.endpoint);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.endpoint}/${id}`);
  }

  getTopSellingProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.endpoint}/TopSelling`);
  }

  addProducto(producto: Producto): boolean {
    try {
      this.http.post<Producto>(this.endpoint, producto);
    } catch (e) {
      return false;
    }
    return true;
  }

  updateProducto(producto: Producto): boolean {
    try {
      this.http.put<Producto>(`${this.endpoint}/${producto.id}`, producto);
    } catch (e) {
      return false;
    }
    return true;
  }

  deleteProducto(id: number): boolean {
    try {
      this.http.delete<Producto>(`${this.endpoint}/${id}`);
    } catch (e) {
      return false;
    }
    return true;
  }

  getProductoByTipo(tipo: TipoProducto) {
    return this.productos.filter((producto) => producto.tipo === tipo);
  }
}
