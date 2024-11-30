import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '~/lib/types';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://191.101.1.86:5000/';
  private apiServer = 'hhttps://191.101.1.86:7268/api/';

  private productos: Producto[] = [];

  constructor(private http: HttpClient) {}

  getUsersReport(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}reportes/users`, {});
  }

  getInventarioMp(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}reportes/InventarioMPs`, {});
  }

  getVentas(date: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}reportes/ventas`, { date });
  }

  getProductos(): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiServer}Productos`, {});
  }

  getPredict(data: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}predict`, { data });
  }

  getPredictRege(data: any[]): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    return this.http.post<any>(
      `${this.apiUrl}predictRege`,
      { data },
      { headers: headers }
    );
  }
}
