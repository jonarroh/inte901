import { Injectable } from '@angular/core';
import { ENDPOINTS } from '~/lib/endpoint';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeUser, PromocionesDTO, PromocionesPersonalizadasDTO } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  apiURL = ENDPOINTS.promociones;
  apiURL2 = ENDPOINTS.promocionesPersonalizadas;
  apiVentas = ENDPOINTS.ventas;

  constructor(private http: HttpClient) { }

  getBadgeId(idUser: number): Observable<BadgeUser[]> {
    return this.http.get<BadgeUser[]>(`http://191.101.1.86:3000/badge/user/${idUser}`);
  }

  getPromociones(idBadge: number): Observable<PromocionesDTO[]> {
    return this.http.get<PromocionesDTO[]>(`${this.apiURL}/Promos`);
  }

  updatePromocion(idPromo: number, promocion: PromocionesDTO): Observable<PromocionesDTO> {
    return this.http.put<PromocionesDTO>(`${this.apiURL}/updatePromocion/${idPromo}`, promocion);
  }

  getPromosPersonalizadas(idBadge: number): Observable<PromocionesPersonalizadasDTO[]> {
    return this.http.get<PromocionesPersonalizadasDTO[]>(`${this.apiURL2}/allPromocionesPersonalizadas/${idBadge}`);
  }

  getMostSoldProducts(userID: number): Observable<any> {
    return this.http.get<any>(`${this.apiVentas}/mostPurchasedProduct/${userID}`);
  }
}
