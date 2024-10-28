import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { MateriaPrima } from '../interface/materias-primas';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MateriasPrimasService {
  apiURL = ENDPOINTS.materia_prima;

  constructor(private http: HttpClient) {}

  getMateriaPrima = (): Observable<MateriaPrima[]> =>
    this.http.get<MateriaPrima[]>(`${this.apiURL}`);

  registrarMateriaPrima(data: MateriaPrima): Observable<MateriaPrima> {
    return this.http.post<MateriaPrima>(this.apiURL, data);
  }

  editarMateriaPrima(id: number, data: MateriaPrima): Observable<MateriaPrima> {
    return this.http.put<MateriaPrima>(`${this.apiURL}/${id}`, data);
  }

  eliminarMateriaPrima(id: number): Observable<void> {
    return this.http.get<MateriaPrima>(`${this.apiURL}/${id}`).pipe(
      switchMap((materiaPrima) => {
        materiaPrima.estatus = 0;
        materiaPrima.deletedAt = new Date().toISOString();
        return this.http.put<void>(`${this.apiURL}/${id}`, materiaPrima);
      })
    );
  }

  getMateriaPrimaById(id: number): Observable<MateriaPrima> {
    return this.http.get<MateriaPrima>(`${this.apiURL}/${id}`);
  }
}
