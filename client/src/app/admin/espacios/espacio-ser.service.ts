import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of , catchError, map} from 'rxjs';
import { Espacio } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class EspacioSerService {

  private apiUrl = 'http://localhost:7268/api/Espacios';
  
  constructor(private http: HttpClient) { }

  getPlaces(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(this.apiUrl).pipe(
      catchError(this.handleError<Espacio[]>('getPlaces', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getPlaceById(id : number): Observable<Espacio>{
    return this.http.get<Espacio>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Espacio>('getPlaceById'))
    );
  }

  addPlace(espacio: Espacio): Observable<Espacio>{
    return this.http.post<Espacio>(this.apiUrl, espacio).pipe(
      catchError(this.handleError<Espacio>('addPlace'))
    );
  }

  updatePlace(id: number, espacio: Espacio): Observable<Espacio>{
    return this.http.put<Espacio>(`${this.apiUrl}/${id}`, espacio).pipe(
      catchError(this.handleError<Espacio>('updatePlace'))
    );
  }

  deletePlace(id: number): Observable<Espacio>{
    return this.http.delete<Espacio>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Espacio>('deletePlace'))
    );
  }

  
  
}
