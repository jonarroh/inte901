import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Producto } from '../interface/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiURL = ENDPOINTS.producto;
  
  constructor(private http:HttpClient) {}

  getProductos = (): Observable<Producto[]> =>
    this.http.get<Producto[]>(`${this.apiURL}`)
  
  registrarProductos(data:Producto): Observable<Producto[]>{
    return this.http.post<Producto[]>(`${this.apiURL}`, data)
  } 
}
