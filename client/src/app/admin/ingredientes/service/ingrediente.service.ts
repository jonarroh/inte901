import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Ingrediente } from '../interface/ingrediente';
import { ProductoService } from '../../productos/service/producto.service';
import { MateriasPrimasService } from '../../materias-primas/service/materias-primas.service';

@Injectable({
  providedIn: 'root'
})
export class IngredienteService {

  apiURL = ENDPOINTS.ingrediente;

  constructor(
    private http: HttpClient,
    private productoService: ProductoService,
    private materiaPrimaService: MateriasPrimasService
  ) {}

  getIngredientes = (): Observable<Ingrediente[]> =>
    this.http.get<Ingrediente[]>(`${this.apiURL}`).pipe(
      switchMap(ingredientes => {
        // Obtiene los nombres de productos y materias primas asociados
        const ingredienteObservables = ingredientes.map(ingrediente =>
          forkJoin({
            producto: this.productoService.getProductoById(ingrediente.idProducto!),
            materiaPrima: this.materiaPrimaService.getMateriaPrimaById(ingrediente.idMateriaPrima!)
          }).pipe(
            map(({ producto, materiaPrima }) => ({
              ...ingrediente,
              nombreProducto: producto.nombre,
              nombreMateriaPrima: materiaPrima.material
            }))
          )
        );
        return forkJoin(ingredienteObservables);
      })
    );

  registrarIngredientes(data: Ingrediente): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.apiURL, data);
  }

  editarIngrediente(id: number, data: Ingrediente): Observable<Ingrediente> {
    return this.http.put<Ingrediente>(`${this.apiURL}/${id}`, data);
  }

  eliminarIngrediente(id: number): Observable<void> {
    return this.http.get<Ingrediente>(`${this.apiURL}/${id}`).pipe(
      switchMap(ingrediente => {
        ingrediente.estatus = 0;
        return this.http.put<void>(`${this.apiURL}/${id}`, ingrediente);
      })
    );
  }

  getIngredienteById(id: number): Observable<Ingrediente> {
    return this.http.get<Ingrediente>(`${this.apiURL}/${id}`);
  }
}
