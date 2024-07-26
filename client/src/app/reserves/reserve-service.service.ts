import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Reserva, DetailReserva } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class ReserveServiceService {

  private apiUrl = 'https://localhost:7268/api/Reserves';

  constructor(private http: HttpClient) { }

  // Método para agregar una reserva
  addReservation(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }


  // Método para obtener reservas por ID de espacio
  getReservesBySpaceId(idEspacio: number): Observable<Reserva[]> {
    const url = `${this.apiUrl}/bySpace/${idEspacio}`;
    return this.http.get<Reserva[]>(url)
      .pipe(
        catchError(this.handleError<Reserva[]>('getReservesBySpaceId', []))
      );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
