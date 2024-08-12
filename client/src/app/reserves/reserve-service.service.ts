import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Reserva, DetailReserva, ReservaDTO } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class ReserveServiceService {

  private apiUrl = 'https://localhost:7268/api/Reserves'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Obtener reservas por ID de espacio
  getReservasByEspacio(idEspacio: number): Observable<Reserva[]> {
    const url = `${this.apiUrl}/bySpace/${idEspacio}`;
    return this.http.get<Reserva[]>(url).pipe(
      catchError(this.handleError<Reserva[]>('getReservasByEspacio', []))
    );
  }

  getReservationsBySpaceId(idEspacio: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/bySpace/${idEspacio}`);
  }

  // Este método también debe devolver un Observable
  addEvent(reserva: ReservaDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, reserva);
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Método adicional si es necesario para otras operaciones
  getAllReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl).pipe(
      catchError(this.handleError<Reserva[]>('getAllReservas', []))
    );
  }

  getReservaById(id: number): Observable<Reserva> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Reserva>(url).pipe(
      catchError(this.handleError<Reserva>(`getReservaById id=${id}`))
    );
  }

  addReserva(reserva: ReservaDTO): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva).pipe(
      catchError(this.handleError<Reserva>('addReserva'))
    );
  }

  updateReserva(id: number, reserva: ReservaDTO): Observable<Reserva> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Reserva>(url, reserva).pipe(
      catchError(this.handleError<Reserva>('updateReserva'))
    );
  }

  deleteReserva(id: number): Observable<Reserva> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Reserva>(url).pipe(
      catchError(this.handleError<Reserva>('deleteReserva'))
    );
  }

  private events: { [key: string]: { name: string; startTime: string; endTime: string }[] } = {
    '2024-07-11': [
      { name: 'Reunión', startTime: '10:00', endTime: '11:00' },
      { name: 'Almuerzo', startTime: '13:00', endTime: '14:00' },
    ],
    '2024-07-12': [{ name: 'Cita médica', startTime: '09:00', endTime: '10:00' }],
  };

  getEvents(date: string): { name: string; startTime: string; endTime: string }[] {
    return this.events[date] || [];
  }

  
}
