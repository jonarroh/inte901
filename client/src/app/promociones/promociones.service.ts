import { Injectable } from '@angular/core';
import { ENDPOINTS } from '~/lib/endpoint';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromocionesDTO } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  apiURL = ENDPOINTS.promociones;

  constructor(private http: HttpClient) { }

  getPromociones = () =>
    this.http.get<PromocionesDTO[]>(`${this.apiURL}/allPromociones`)
}
