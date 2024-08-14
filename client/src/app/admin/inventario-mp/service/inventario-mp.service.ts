import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { InventarioMP } from '../interface/inventarioMP';
import { MateriasPrimasService } from '../../materias-primas/service/materias-primas.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioMPService {
  apiURL = ENDPOINTS.inventarioMP;

  constructor(
    private http: HttpClient,
    private materiaPrimaService: MateriasPrimasService
  ) {}

  getInventarios = (): Observable<InventarioMP[]> =>
    this.http.get<InventarioMP[]>(`${this.apiURL}`).pipe(
      switchMap(inventarios => {
        const inventarioObservables = inventarios.map(inventario =>
          this.materiaPrimaService.getMateriaPrimaById(inventario.idMateriaPrima!).pipe(
            map(materiaPrima => ({
              ...inventario,
              nombreMateriaPrima: materiaPrima.material // Asume que `material` es el nombre de la materia prima
            }))
          )
        );
        return forkJoin(inventarioObservables);
      })
    );

  registrarInventario(data: InventarioMP): Observable<InventarioMP> {
    return this.http.post<InventarioMP>(this.apiURL, data);
  }

  editarInventario(id: number, data: InventarioMP): Observable<InventarioMP> {
    return this.http.put<InventarioMP>(`${this.apiURL}/${id}`, data);
  }

  eliminarInventario(id: number): Observable<void> {
    return this.http.get<InventarioMP>(`${this.apiURL}/${id}`).pipe(
      switchMap(inventario => {
        inventario.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, inventario);
      })
    );
  }
}