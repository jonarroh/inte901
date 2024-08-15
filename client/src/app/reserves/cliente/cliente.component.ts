import { Component, OnInit } from '@angular/core';
import { ReservaSerService } from '~/app/admin/reservas/reserva-ser.service';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { ReservaDTO } from '~/lib/types';
import { ReserveServiceService } from '../reserve-service.service';
import { CommonModule } from '@angular/common';
import { PlaceServiceService } from '~/app/place/place-service.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  orders: ReservaDTO[] = [];
  error: string | null = null;
  searchTerm: string = '';
  selectedFilter: string = '';
  placeNames: Map<number, string> = new Map();

  constructor(
    private reservaUsuario: ReserveServiceService,
    private placeService: PlaceServiceService
  ) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId !== null) {
      this.reservaUsuario.getReservasByCliente(userId).subscribe({
        next: (data) => {
          this.orders = data;
          console.log('Reservations:', this.orders);
        },
        error: (err) => {
          console.error('Error fetching reservations', err);
          this.error = 'No se pudieron cargar las reservas. Por favor, inténtelo de nuevo más tarde.';
        }
      });
    } else {
      this.error = 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.';
    }
  }

  private getUserIdFromLocalStorage(): number | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        // Asegúrate de que 'id' es el campo correcto en tu estructura de datos
        return parsedData.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private loadPlaceNames(): void {
    const spaceIds = new Set(this.orders.map(order => order.detailReserva.idEspacio));
    spaceIds.forEach(id => {
      this.placeService.getPlaceById(id).subscribe({
        next: (place) => {
          console.log(`Loaded place ${id}:`, place); // Mensaje de depuración
          this.placeNames.set(id, place.nombre); // Almacenar el nombre del espacio
        },
        error: (err) => {
          console.error(`Error fetching place with ID ${id}`, err);
        }
      });
    });
  }


  filteredOrders(): ReservaDTO[] {
    return this.orders.filter(order => {
      const matchesStatus = this.selectedFilter === '' || order.estatus === this.selectedFilter;
      const matchesSearchTerm =
        order.detailReserva.toString().includes(this.searchTerm) ||
        order.detailReserva.idEspacio.toString().includes(this.searchTerm);

      return matchesStatus && matchesSearchTerm;
    });
  }

  getStatusColor(status: string, step: number): string {
    const statusColors = {
      'Pagado': ['#7ec88b', 'gray', 'gray'],
      'Cancelada': ['#f17d6f', 'gray', 'gray'],
      'Finalizada': ['#f3e860', '#f3bb60', 'gray']
    };
    const statusColor = statusColors[status as keyof typeof statusColors];
    return statusColor ? statusColor[step - 1] : '#d3d3d3';
  }

  getSpaceName(id: number): string {
    return this.placeNames.get(id) || 'Desconocido';
  }
}
