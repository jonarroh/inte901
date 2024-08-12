import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINTS } from '~/lib/endpoint';
import { MateriaPrimaProveedor } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class MppService {
  apiURL = ENDPOINTS.materiaPrimaProveedor;

  constructor(private http: HttpClient) { }

  getMPP = () =>
    this.http.get<MateriaPrimaProveedor[]>(`${this.apiURL}`)
}
