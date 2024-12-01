import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaceServiceService {
  private apiUrl = 'http://191.101.1.86:5275/api/Espacios';

  constructor(private http: HttpClient) {}

  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPlaceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
