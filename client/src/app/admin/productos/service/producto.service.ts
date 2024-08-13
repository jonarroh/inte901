import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ENDPOINTS } from '~/lib/endpoint';
import { Producto } from '../interface/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiURL = ENDPOINTS.producto;
  
  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiURL}`);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiURL}/${id}`);
  }

  registrarProductos(data: Producto, imagen: File): Observable<Producto> {
    const formData = new FormData();
    formData.append('nombre', data.nombre || '');
    formData.append('precio', data.precio?.toString() || '');
    formData.append('descripcion', data.descripcion || '');
    formData.append('estatus', data.estatus?.toString() || '1');
    formData.append('tipo', data.tipo || '');
    formData.append('cantidadXReceta', data.cantidadXReceta?.toString() || '');
    formData.append('temperatura', data.temperatura || '');
    formData.append('createdAt', data.createdAt || new Date().toISOString());
    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.post<Producto>(this.apiURL, formData);
  }

  editarProducto(id: number, data: Producto, imagen?: File): Observable<Producto> {
    const formData = new FormData();
    formData.append('nombre', data.nombre || '');
    formData.append('precio', data.precio?.toString() || '');
    formData.append('descripcion', data.descripcion || '');
    formData.append('estatus', data.estatus?.toString() || '1');
    formData.append('tipo', data.tipo || '');
    formData.append('cantidadXReceta', data.cantidadXReceta?.toString() || '');
    formData.append('temperatura', data.temperatura || '');
    formData.append('createdAt', data.createdAt || new Date().toISOString());
    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.put<Producto>(`${this.apiURL}/${id}`, formData);
  }

  eliminarProducto(id: number): Observable<Producto> {
    return this.getProductoById(id).pipe(
      switchMap(producto => {
        // Cambiar solo el estatus a 0
        producto.estatus = 0;
  
        // Si tienes la imagen almacenada en el objeto producto, puedes enviarla de nuevo
        const imagenFile = producto.imagen ? this.dataURLtoFile(producto.imagen, `producto-${id}.webp`) : undefined;
  
        // Reutilizar el método de editar producto
        return this.editarProducto(id, producto, imagenFile || undefined);
      })
    );
  }
  
  // Método auxiliar para convertir DataURL en File
  private dataURLtoFile(dataurl: string, filename: string): File | null {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
  
    if (!match) {
      console.error('Data URL does not contain a valid MIME type.');
      return null;
    }
  
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  }
  
  
}
