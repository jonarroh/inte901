import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Reserva, ReservaDTO } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class ReservaSerService {


  private apiUrl = 'https://localhost:7268/api/Reserves'; // URL base de la API

  constructor(private http: HttpClient) {}
  
  getAllReservas(): Observable<ReservaDTO[]> {
    return this.http.get<ReservaDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError<ReservaDTO[]>('getAllReservas', []))
    );
  }
  

  deleteReserva(id: number): Observable<Reserva> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Reserva>(url).pipe(
      catchError(this.handleError<Reserva>('deleteReserva'))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  updateReservaStatus(id: number, estatus: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/estatus/${id}`, JSON.stringify(estatus), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}
