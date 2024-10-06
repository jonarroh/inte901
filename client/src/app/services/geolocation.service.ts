import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDTO } from '.';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  apiUrl = 'http://localhost:3000/location';
  location: LocationDTO | null = null;

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation no es soportado por este navegador.'));
      }
    });
  }

  // Detener la observación de la posición
  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  createAnonymousToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  saveAnonymousToken(token: string): void {
    localStorage.setItem('anonymousToken', token);
  }

  getAnonymousToken(): string {
    return localStorage.getItem('anonymousToken') || '';
  }


  sendLocation(location: LocationDTO): void {
    this.http.post(this.apiUrl, location).subscribe();
  }





}
