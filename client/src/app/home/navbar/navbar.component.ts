import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { HlmInputDirective, HlmInputModule } from '~/components/ui-input-helm/src';
import { IconComponent } from '../icon/icon.component';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { ProductosService } from '../services/productos.service';
import { NgFor, NgIf } from '@angular/common';
import { Espacio, Producto } from '~/lib/types';
import { FormsModule } from '@angular/forms';
import { CartComponent } from '~/app/cart/cart.component';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PlaceServiceService } from '~/app/place/place-service.service';
import { ReserveComponent } from '../reserve/reserve.component';
import { SearchComponent } from '../search/search.component';
import { UserService } from '../services/user.service';

export interface SearchItem {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

@Component({
  selector: 'home-navbar',
  standalone: true,
  imports: [
    HlmInputDirective,
    LucideAngularModule,
    IconComponent,
    HlmCommandImports,
    NgIf,
    NgFor,
    FormsModule,
    CartComponent,
    RouterModule,
    ReserveComponent,
    SearchComponent
  ],
  providers: [ProductosService, PlaceServiceService,Router],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  items: SearchItem[] = [];
  filteredItems: SearchItem[] = [];
  dropdownOpen = false;
  searchTerm = '';
  currentFilter = 'Todo';

  puntos = signal(0);


  constructor(private productosService: ProductosService, private router: Router, private espaciosService: PlaceServiceService, private userService: UserService) {
    this.loadData();
    this.userService.getPoints().subscribe({
      next: (points) => {
        
        // @ts-ignore
        console.log("points", points.points);
        // @ts-ignore
        this.puntos.set(points.points);
      },
      error: (error) => {
        console.error('Error al cargar los puntos', error);
      }
    });
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
  
  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }
}
