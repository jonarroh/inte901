import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContraseñaNueva } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class RecuServiceService {

  private apiUrl = 'http://localhost:3000/password/create';
  private api2Url = 'http://localhost:5275/api/Users/forceChangePassword';
  constructor(private http: HttpClient) { }

  sendCode( email:string, id:number): Observable<any>{
    const body = { email,id}
    return this.http.post(this.apiUrl, body);
  }

  savePass(data :ContraseñaNueva): Observable<any>{
    return this.http.post(this.api2Url, data);
  }
}
