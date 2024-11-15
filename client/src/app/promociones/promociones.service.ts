import { Injectable } from '@angular/core';
import { ENDPOINTS } from '~/lib/endpoint';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeUser, PromocionesDTO } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  apiURL = ENDPOINTS.promociones;

  constructor(private http: HttpClient) { }

  // getPromociones = () =>
  //   this.http.get<PromocionesDTO[]>(`${this.apiURL}/allPromociones`)

  getBadgeId(idUser: number): Observable<BadgeUser[]> {
    return this.http.get<BadgeUser[]>(`http://localhost:3000/badge/user/${idUser}`);
  }

  getPromociones(idBadge: number): Observable<PromocionesDTO[]> {
    return this.http.get<PromocionesDTO[]>(`${this.apiURL}/allPromociones/${idBadge}`);
  }
}
