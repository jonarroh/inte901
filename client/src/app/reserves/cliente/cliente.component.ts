import { Component, computed, effect, OnInit, signal, TrackByFunction } from '@angular/core';
import { ReservaSerService } from '~/app/admin/reservas/reserva-ser.service';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { DetailReservaDTO, ReservaDTO } from '~/lib/types';
import { ReserveServiceService } from '../reserve-service.service';
import { CommonModule } from '@angular/common';
import { PlaceServiceService } from '~/app/place/place-service.service';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { createFormField, createFormGroup, V } from 'ng-signal-forms';

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

  
  // constructor(
  //   private reservaUsuario: ReserveServiceService,
  //   private placeService: PlaceServiceService
  // ) {}

  constructor(private reservaService: ReserveServiceService) {
    effect(() => this._nameFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this._users.set(users);
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
      }
    });
  }


  protected readonly _rawFilterInput = signal('');
  protected readonly _nameFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _selectionModel = new SelectionModel<DetailReservaDTO>(true);
  protected readonly _isUserSelected = (reser: DetailReservaDTO) => this._selectionModel.isSelected(reser);
  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(() => this._selectionModel.selected)),{
      initialValue: []
    }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    Fecha: {visible: true, label: 'fecha', sortable: true},
    HoraInicio: {visible: true, label: 'horaInicio', sortable: true},
    HoraFin: {visible: true, label: 'horaFin', sortable: true},
  })

  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _reserv = signal<DetailReservaDTO[]>([]);

  private readonly _filteredUsers = computed(() => {
    const nameFilter = this._nameFilter()?.trim()?.toLowerCase();
    if (nameFilter && nameFilter.length > 0) {
      return this._reserv().filter((u) => u.fecha.toLowerCase().includes(nameFilter));
    }
    return this._reserv();
  });

  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._nameFilter();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredUsers();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.fecha.localeCompare(p2.fecha))
      .slice(start, end);
  });

  protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
    this._filteredSortedPaginatedPayments().every((payment) => this._selected().includes(payment)),
  );

  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<DetailReservaDTO> = (_: number, p: DetailReservaDTO) => p.idDetailReser;
  protected toggleUser(payment: DetailReservaDTO) {
    this._selectionModel.toggle(payment);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedPayments());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
    }
  }

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

  onDeletedUser(resr: DetailReservaDTO) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        toast.success('Usuario eliminado correctamente');

        this._users.set(this._users().filter((u) => u.id !== user.id));
      },
      error: (error) => {
        console.error('Error al eliminar el usuario', error);
        toast.error('Error al eliminar el usuario');
  }
  });
  }

  
}
