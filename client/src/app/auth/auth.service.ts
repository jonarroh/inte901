import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINTS } from '~/lib/endpoint'; // Asegúrate de que la ruta sea correcta
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Observable<any> {
    const body = { email: username, password, role: 'admin' };
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

  logout(): void {
    localStorage.removeItem('token');
  }
}
