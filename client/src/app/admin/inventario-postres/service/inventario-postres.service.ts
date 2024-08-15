import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { InventarioPostre } from '../interface/InventarioPostres';
import { ProductoService } from '../../productos/service/producto.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioPostresService {

  apiURL = ENDPOINTS.inventarioPostre;

  constructor(private http: HttpClient,
    private productoService: ProductoService
  ) {}

  getInventarios = (): Observable<InventarioPostre[]> =>
    this.http.get<InventarioPostre[]>(this.apiURL).pipe(
      switchMap(inventarios => {
        const inventarioObservables = inventarios.map(inventario =>
          this.productoService.getProductoById(inventario.idProducto!).pipe(
            map(producto => ({
              ...inventario,
              nombreProducto: producto.nombre // Asumiendo que el campo `nombre` contiene el nombre del producto
            }))
          )
        );
        return forkJoin(inventarioObservables);
      })
    );


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
