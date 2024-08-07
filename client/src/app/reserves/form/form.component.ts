import { Component, OnInit } from '@angular/core';
import { ReserveServiceService } from '../reserve-service.service';
import { format, getDaysInMonth, getDay, startOfMonth, addDays, addMonths, subMonths } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { es } from 'date-fns/locale';
import { Reserva } from '~/lib/types';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';

@Component({
  selector: 'calendar-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  idEspacio: number = 1; // Asegúrate de establecer este valor según sea necesario
  month: string;
  year: number;
  daysInMonth: Date[] = [];
  showModal: boolean = false;
  eventName: string = '';
  eventStartTime: string = '';
  eventEndTime: string = '';
  eventDate: string = '';
  selectedDate: Date | null = null;
  reservations: Reserva[] = [];

  constructor(private eventService: ReserveServiceService) {
    const today = new Date();
    this.month = format(today, 'LLLL', { locale: es });
    this.year = today.getFullYear();
    this.generateCalendar();
  }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.eventService.getReservationsBySpaceId(this.idEspacio).subscribe(
      (data: Reserva[]) => {
        this.reservations = data;
        this.generateCalendar();
      },
      (error) => {
        console.error('Error fetching reservations', error);
      }
    );
  }

  generateCalendar() {
    this.daysInMonth = [];
    const date = new Date(this.year, this.getMonthNumber(this.month), 1);
    const firstDay = getDay(startOfMonth(date));
    const lastDay = getDaysInMonth(date);

    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.push(addDays(startOfMonth(date), i - firstDay));
    }

    for (let i = 1; i <= lastDay; i++) {
      this.daysInMonth.push(new Date(this.year, this.getMonthNumber(this.month), i));
    }

    for (let i = lastDay + 1; i <= 42 - this.daysInMonth.length; i++) {
      this.daysInMonth.push(addDays(date, i - lastDay));
    }
  }

  getMonthName(month: number): string {
    return format(new Date(this.year, month), 'LLLL', { locale: es });
  }

  getMonthNumber(month: string): number {
    const date = new Date(this.year, 0);
    return Array.from({ length: 12 }, (_, i) => format(addMonths(date, i), 'LLLL', { locale: es })).indexOf(month);
  }

  prevMonth() {
    const date = subMonths(new Date(this.year, this.getMonthNumber(this.month), 1), 1);
    this.month = this.getMonthName(date.getMonth());
    this.year = date.getFullYear();
    this.generateCalendar();
  }

  nextMonth() {
    const date = addMonths(new Date(this.year, this.getMonthNumber(this.month), 1), 1);
    this.month = this.getMonthName(date.getMonth());
    this.year = date.getFullYear();
    this.generateCalendar();
  }

  getEvents(date: Date): Reserva[] {
    const dateString = this.formatDate(date);
    return this.reservations.filter((event) => this.formatDate(new Date(event.startTime)) === dateString);
  }

  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  openModal(date: Date | null) {
    if (date) {
      this.selectedDate = date;
      this.eventDate = this.formatDate(date);
    } else {
      this.selectedDate = null;
      this.eventDate = '';
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.eventName = '';
    this.eventStartTime = '';
    this.eventEndTime = '';
    this.eventDate = '';
    this.selectedDate = null;
  }

  saveEvent() {
    const reservaDTO = {
      idUsuario: 1,
      idCliente: 3,
      estatus: 'Activo',
      detailReserva: {
        idDetailReser: 0, // Asumido, o eliminar si es autogenerado
        fecha: this.eventDate,
        horaInicio: this.eventStartTime,
        horaFin: this.eventEndTime,
        idEspacio: this.idEspacio
      }
    };
  
    this.eventService.addEvent(reservaDTO).subscribe(
      () => {
        this.closeModal();
        // Actualizar el calendario o realizar alguna otra acción
      },
      (error) => {
        console.error('Error al agregar la reserva:', error);
      }
    );
  }
    
}
