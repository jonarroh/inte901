import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINTS } from '~/lib/endpoint'; // Asegúrate de que la ruta sea correcta
import { from, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GeolocationService } from '../services/geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private geoService: GeolocationService
  ) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login({
    username,
    password,
    captchaToken,
  }: {
    username: string;
    password: string;
    captchaToken: string;
  }): Observable<any> {
    const body = { email: username, password, role: 'admin', captchaToken };
    return this.http.post(ENDPOINTS.login, body).pipe(
      tap((res: any) => {
        if (res && res.jwtToken) {
          localStorage.setItem('token', res.jwtToken);
        }
      }),
      catchError((error) => {
        console.error('Error during login', error);
        throw error; // Rethrow the error so it can be handled by the subscriber
      })
    );
  }

  private apiUrl = 'http://localhost:3000/location';
  logout() {
    let token = localStorage.getItem('token') ?? '';
    from(this.http.delete(`${this.apiUrl}/${token}`)).subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.geoService.location = null;
      },
      error: (error: any) => {
        console.error('Error al cerrar sesión', error);
      },
    });
  }
}
