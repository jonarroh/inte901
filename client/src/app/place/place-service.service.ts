import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceServiceService {

  private apiUrl = 'https://localhost:7268/api/Espacios';

  constructor(private http: HttpClient){}

  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPlaceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
