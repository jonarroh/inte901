import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://127.0.0.1:5000/reportes/users';

  constructor(private http: HttpClient) { }

  getUsersReport(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {});
  }
}

