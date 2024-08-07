import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Ingrediente } from '../interface/ingrediente';

@Injectable({
  providedIn: 'root'
})
export class IngredienteService {

  apiURL = ENDPOINTS.ingrediente;

  constructor(private http:HttpClient) {}

  getIngredientes = (): Observable<Ingrediente[]> =>
    this.http.get<Ingrediente[]>(`${this.apiURL}`)
  
  registrarIngredientes(data: Ingrediente): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.apiURL, data);
  }

  editarIngrediente(id: number, data: Ingrediente): Observable<Ingrediente> {
    return this.http.put<Ingrediente>(`${this.apiURL}/${id}`, data);
  }

  eliminarIngrediente(id: number): Observable<void> {
    return this.http.get<Ingrediente>(`${this.apiURL}/${id}`).pipe(
      switchMap(ingrediente => {
        ingrediente.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, ingrediente);
      })
    );
  }
}
