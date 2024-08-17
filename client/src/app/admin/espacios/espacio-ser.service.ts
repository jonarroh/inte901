

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable, of , catchError, map, throwError} from 'rxjs';
import { Espacio, EspacioDTO } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class EspacioSerService {

  
  private apiUrl = 'https://localhost:7268/api/Espacios';
  
  constructor(private http: HttpClient) { }

  getPlaces(): Observable<EspacioDTO[]> {
    return this.http.get<EspacioDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError<EspacioDTO[]>('getPlaces', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error('${operation} failed: ${error.message}');
      return of(result as T);
    };
  }

  getPlaceById(id : number): Observable<EspacioDTO>{
    return this.http.get<EspacioDTO>('${this.apiUrl}/${id}').pipe(
      catchError(this.handleError<EspacioDTO>('getPlaceById'))
    );
  }

  addPlace(formData: FormData): Observable<EspacioDTO> {
    return this.http.post<EspacioDTO>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'response'
    }).pipe(
      map(response => response.body as EspacioDTO)
    );
  }
  
  updatePlace(id: number, espacio: Espacio): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, espacio, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        console.error('Error en la actualización del espacio', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }
  
  
  

  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('deletePlace'))
    );
  }
  

  
}