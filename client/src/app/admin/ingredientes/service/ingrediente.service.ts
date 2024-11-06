import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Ingrediente } from '../interface/ingrediente';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IngredienteService {
  apiURL = ENDPOINTS.ingrediente;

  constructor(private http: HttpClient) {}

  getIngredientes = (): Observable<Ingrediente[]> =>
    this.http.get<Ingrediente[]>(`${this.apiURL}`);

  registrarIngrediente(data: Ingrediente): Observable<Ingrediente> {
    const ingredienteConEstatus = { ...data, estatus: 1 };
    return this.http.post<Ingrediente>(this.apiURL, ingredienteConEstatus);
  }

  editarIngrediente(id: number, data: Ingrediente): Observable<Ingrediente> {
    const ingredienteConEstatus = { ...data, estatus: 1 };
    return this.http.put<Ingrediente>(
      `${this.apiURL}/${id}`,
      ingredienteConEstatus
    );
  }

  eliminarIngrediente(id: number): Observable<void> {
    return this.http.get<Ingrediente>(`${this.apiURL}/${id}`).pipe(
      switchMap((ingrediente) => {
        ingrediente.estatus = 0;
        ingrediente.deletedAt = new Date().toISOString();
        return this.http.put<void>(`${this.apiURL}/${id}`, ingrediente);
      })
    );
  }

  getIngredienteById(id: number): Observable<Ingrediente> {
    return this.http.get<Ingrediente>(`${this.apiURL}/${id}`);
  }

  getIngredientesByProducto(productoId: number): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(
      `${this.apiURL}/ByProducto/${productoId}`
    );
  }
}
