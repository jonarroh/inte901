
import { Component, computed, effect, OnInit, Signal, signal, TrackByFunction } from '@angular/core';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { DetailReservaDTO, Espacio, Espacio2, EspacioDTO, Reserva, ReservaDTO } from '~/lib/types';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '~/components/ui-dialog-helm/src';
import { LucideAngularModule } from 'lucide-angular';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { HlmLabelDirective } from '~/components/ui-label-helm/src';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { createFormField, createFormGroup, SignalInputDirective, V } from 'ng-signal-forms';
import { BrnSelectImports, BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { FormsModule } from '@angular/forms';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '~/components/ui-command-helm/src';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { CommonModule, DecimalPipe, NgForOf, TitleCasePipe } from '@angular/common';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '~/components/ui-menu-helm/src';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '~/components/ui-table-helm/src';
import { HlmCheckboxCheckIconComponent, HlmCheckboxComponent } from '~/components/ui-checkbox-helm/src';
import { SelectionModel } from '@angular/cdk/collections';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { toast } from 'ngx-sonner';
import { ReservaSerService } from '../reserva-ser.service';
import { PlaceServiceService } from '~/app/place/place-service.service';
import { HlmAlertDialogComponent } from '~/components/ui-alertdialog-helm/src';
@Component({
  selector: 'app-estatus',
  standalone: true,
  imports: [
    NavbarComponent, HlmDialogComponent, HlmDialogContentComponent, HlmDialogFooterComponent,
    LucideAngularModule, BrnDialogContentDirective, BrnDialogTriggerDirective, HlmDialogHeaderComponent,
    HlmDialogTitleDirective,HlmDialogDescriptionDirective, HlmLabelDirective, HlmInputDirective, HlmButtonDirective,
    SignalInputDirective, BrnSelectImports, HlmSelectImports, FormsModule, HlmCommandImports, HlmIconComponent,
    HlmButtonDirective, BrnPopoverComponent, BrnPopoverTriggerDirective, BrnPopoverTriggerDirective, BrnPopoverContentDirective,
    NgForOf, BrnMenuTriggerDirective, HlmMenuModule, BrnTableModule, HlmTableModule, HlmButtonModule, DecimalPipe, TitleCasePipe, HlmIconComponent,
    HlmInputDirective, HlmCheckboxCheckIconComponent, HlmCheckboxComponent, BrnSelectModule, HlmSelectModule, CommonModule
  ],
  templateUrl: './estatus.component.html',
  styleUrl: './estatus.component.css'
})
export class EstatusComponent implements OnInit {

  orders: ReservaDTO[] = [];
  error: string | null = null;
  searchTerm: string = '';
  selectedFilter: string = '';
  placeNames: Map<number, string> = new Map();

  constructor(
    private reservaUsuario: ReservaSerService,
    private placeService: PlaceServiceService
  ) { }


  protected readonly _rawFilterInput = signal('');
  protected readonly _nameFilter = signal('');

  private readonly _selectionModel = new SelectionModel<DetailReservaDTO>(true);
  protected readonly _isUserSelected = (reser: DetailReservaDTO) => this._selectionModel.isSelected(reser);
  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(() => this._selectionModel.selected)), {
    initialValue: []
  }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    Fecha: { visible: true, label: 'fecha', sortable: true },
    HoraInicio: { visible: true, label: 'horaInicio', sortable: true },
    HoraFin: { visible: true, label: 'horaFin', sortable: true },
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

  ngOnInit(): void {
    this.reservaUsuario.getAllReservas().subscribe({
      next: (reservas: ReservaDTO[]) => {
        this.orders = reservas;
        console.log('Reservations:', this.orders);
        this.loadPlaceNames(); // Ensure place names are loaded after reservations
      },
      error: (err) => {
        console.error('Error fetching reservations', err);
        this.error = 'No se pudieron cargar las reservas. Por favor, inténtelo de nuevo más tarde.';
      }
    });
  }


  private mapToReservaDTO(reserva: ReservaDTO): ReservaDTO {
    return {
      idUsuario: reserva.idUsuario || 0, // Default value if missing
      idCliente: reserva.idCliente || 0,
      estatus: reserva.estatus || 'unknown', // Default to 'unknown' if missing
      detailReserva: {
        idDetailReser: reserva.detailReserva.idDetailReser,
        fecha: reserva.detailReserva.fecha,
        horaInicio: reserva.detailReserva.horaInicio,
        horaFin: reserva.detailReserva.horaFin,
        idEspacio: reserva.detailReserva.idEspacio,
      },
      creditCard: reserva.creditCard || {}, // Default empty object if missing
    };
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
      'Finalizada': ['#f3e860', '#f3bb60', '#7ec88b']
    };
    const statusColor = statusColors[status as keyof typeof statusColors];
    return statusColor ? statusColor[step - 1] : '#d3d3d3';
  }

  getSpaceName(id: number): string {
    return this.placeNames.get(id) || 'Desconocido';
  }


  updateStatus(id: number, estatus: Event): void {
    const newStatus = (estatus.target as HTMLInputElement).value;
    this.reservaUsuario.updateReservaStatus(id, newStatus).subscribe({
      next: () => {
        console.log(`Status updated to ${estatus} for reservation ${id}`);
        toast.success('Estatus actualizado', {
          duration: 1200,
          onAutoClose: ((toast) => {
            location.reload();
          })
        });
      },
      error: (err) => {
        console.error('Error updating status', err);
        this.error = 'No se pudo actualizar el estatus. Por favor, inténtelo de nuevo más tarde.';
        toast.error('Error al actualizar el estatus', {
          duration: 1200,
          onAutoClose: ((toast) => {
            location.reload();
          })
        });
      }
    });
  }


}
