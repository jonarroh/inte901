import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerRewadsService {

  private baseUrl = 'http://localhost:3000/badge/user/';
  private promoUrl = 'https://localhost:7268/api/PromocionesPersonalizadas/allPromocionesPersonalizadas/';

  constructor(private http: HttpClient) {}

  getBadgesByUserId(userId: string): Observable<{ images: string[] }> {
    return this.http.get<{ images: string[] }>(`${this.baseUrl}${userId}`);
  }

  getPromoByBadgeId(userBad: string): Observable<any> {
    return this.http.get<{ images: string[] }>(`${this.promoUrl}${userBad}`);
  }

}
