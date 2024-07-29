import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINTS } from '~/lib/endpoint';
import { Proveedor } from './interface/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  apiURL =ENDPOINTS.proveedores;

  constructor(private http: HttpClient) { }

  getProveedores = () =>
    this.http.get<Proveedor[]>(`${this.apiURL}/`)
}
