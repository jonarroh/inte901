import { Component } from '@angular/core';
import { SearchItem } from '../navbar/navbar.component';
import { ProductosService } from '../services/productos.service';
import { Router } from '@angular/router';
import { PlaceServiceService } from '~/app/place/place-service.service';
import { Espacio, Producto } from '~/lib/types';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'nav-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  providers: [ProductosService, PlaceServiceService, Router]
})
export class SearchComponent {
  items: SearchItem[] = [];
  filteredItems: SearchItem[] = [];
  dropdownOpen = false;
  searchTerm = '';
  currentFilter = 'Todo';
  @Input() isHiddenInMobile = true;

  constructor(private productosService: ProductosService, private router: Router, private espaciosService: PlaceServiceService) {
    this.loadData();
  }

  private loadData() {
    forkJoin({
      productos: this.productosService.getProductos(),
      espacios: this.espaciosService.getPlaces()
    }).subscribe({
      next: ({ productos, espacios }) => {
        const mappedProductos = productos.map((producto: Producto) => ({
          descripcion: producto.descripcion,
          id: String(producto.id),
          nombre: producto.nombre,
          tipo: producto.tipo
        } as SearchItem));

        const mappedEspacios = espacios.map((espacio: Espacio) => ({
          id: String(espacio.idEspacio),
          nombre: espacio.nombre,
          descripcion: espacio.descripcion,
          tipo: 'Reservacion'
        } as SearchItem));

        this.items = [...mappedProductos, ...mappedEspacios];
        this.filterItems();
      },
      error: (error) => {
        console.error('Error al cargar los datos', error);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.filterItems();
    this.dropdownOpen = false; // Opcional: cerrar el dropdown al seleccionar un filtro
  }

  filterItems() {
    if (this.searchTerm === '') {
      this.filteredItems = this.items.filter(item =>
        this.currentFilter === 'Todo' || item.tipo === this.currentFilter
      );
    } else {
      this.filteredItems = this.items.filter(item =>
        item.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.currentFilter === 'Todo' || item.tipo === this.currentFilter)
      );
    }
  }
  
  navigateTo(item: SearchItem) {
    if (item.tipo === 'Reservacion') {
      this.router.navigate(['/places']);
    } else {
      this.router.navigate(['/products', item.id
      ]);
    }
  }

}
