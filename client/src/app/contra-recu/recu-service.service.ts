import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContraseñaNueva } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class RecuServiceService {

  private apiUrl = 'http://191.101.1.86:3000/password/create';
  private api2Url = 'http://191.101.1.86:3000/password/change';
  constructor(private http: HttpClient) { }

  sendCode( email:string): Observable<any>{
    const body = { email}
    return this.http.post(this.apiUrl, body);
  }

  savePass(data :ContraseñaNueva): Observable<any>{
    return this.http.post(this.api2Url, data);
  }
}
