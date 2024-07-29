import { Component, OnInit } from '@angular/core';
import { ReserveServiceService } from '../reserve-service.service';
import { format, getDaysInMonth, getDay, startOfMonth, addDays, addMonths, subMonths } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { es } from 'date-fns/locale';
import { ActivatedRoute } from '@angular/router';
import { Reserva, DetailReserva} from '~/lib/types';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';

@Component({
  selector: 'calendar-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  month: string;
  year: number;
  daysInMonth: Date[] = [];
  showModal: boolean = false;
  eventStartTime: string = '';
  eventEndTime: string = '';
  eventDate: string = '';
  selectedDate: Date | null = null;
  events: { [key: string]: { name: string; startTime: string; endTime: string }[] } = {};

  constructor(private eventService: ReserveServiceService, private route: ActivatedRoute) {
    const today = new Date();
    this.month = format(today, 'LLLL', { locale: es });
    this.year = today.getFullYear();
  }

  ngOnInit() {
    this.generateCalendar();
    this.loadReservations();
  }

  loadReservations() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.eventService.getReservesBySpaceId(id).subscribe((data: Reserva[]) => {
        data.forEach(reservation => {
          const date = new Date(reservation.detailReserva.fecha);
          const dateString = this.formatDate(date);
          if (!this.events[dateString]) {
            this.events[dateString] = [];
          }
          this.events[dateString].push({
            name: 'Reserva',
            startTime: reservation.detailReserva.horaInicio,
            endTime: reservation.detailReserva.horaFin
          });
        });
        this.generateCalendar();
      });
    }
  }

  getEvents(date: Date) {
    const dateString = this.formatDate(date);
    return this.events[dateString] || [];
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
    const date = new Date(this.year, this.getMonthNumber(this.month), 1);
    const newDate = subMonths(date, 1);
    this.month = this.getMonthName(newDate.getMonth());
    this.year = newDate.getFullYear();
    this.generateCalendar();
  }

  nextMonth() {
    const date = new Date(this.year, this.getMonthNumber(this.month), 1);
    const newDate = addMonths(date, 1);
    this.month = this.getMonthName(newDate.getMonth());
    this.year = newDate.getFullYear();
    this.generateCalendar();
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
    this.eventStartTime = '';
    this.eventEndTime = '';
    this.eventDate = '';
    this.selectedDate = null;
  }
  
  saveEvent() {
    if (this.eventDate && this.eventStartTime && this.eventEndTime) {
      // Crear el objeto Reserva
    
      
  
     
    }
  }
}
