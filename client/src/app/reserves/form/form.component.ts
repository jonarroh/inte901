import { Component, OnInit, signal } from '@angular/core';
import { ReserveServiceService } from '../reserve-service.service';
import { format, getDaysInMonth, getDay, startOfMonth, addDays, addMonths, subMonths } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { es } from 'date-fns/locale';
import { CreditCard, Reserva, ReservaDTO } from '~/lib/types';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { UserService } from '~/app/home/services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'calendar-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  providers: [
    ReserveServiceService,
    UserService
  ],
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

  creditCards = signal<CreditCard[]>([]);
  selectedCreditCard = signal<CreditCard>({} as CreditCard);

  constructor(private eventService: ReserveServiceService,private UserService: UserService) {
    this.creditCards.set(
      this.UserService.userData().creditCards
    )
    console.log('creditCards', this.creditCards);

    const today = new Date();
    this.month = format(today, 'LLLL', { locale: es });
    this.year = today.getFullYear();
    this.generateCalendar();
  }

  ngOnInit() {
    // this.loadReservations();
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

    console.log("Calenario generado", this.daysInMonth);
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
    if(this.selectedCreditCard().id === undefined){
      toast.error('Selecciona una tarjeta de crédito');
      return; 
    }
    //si la hora de inicio es mayor a la hora de fin
    if(this.eventStartTime >= this.eventEndTime){
      toast.error('La hora de inicio no puede ser mayor o igual a la hora de fin');
      return;
    }

    //si la hora de inicio es igual a la hora de fin
    if(this.eventStartTime === this.eventEndTime){
      toast.error('La hora de inicio no puede ser igual a la hora de fin');
      return;
    }
    //si la fecha es anterior a la fecha actual
    if(this.eventDate < this.formatDate(new Date())){
      toast.error('La fecha no puede ser anterior a la actual');
      return;
    }
    //si la fecha es igual a la fecha actual debe ser mayor a la hora actual
    if(this.eventDate === this.formatDate(new Date())){
      if(this.eventStartTime <= format(new Date(), 'HH:mm')){
        toast.error('La hora de inicio no puede ser menor o igual a la hora actual');
        return;
      }
    }

    //si la hora es mayor a las 22:00 y menor a las 6:00
    if(this.eventStartTime >= '22:00' || this.eventStartTime <= '06:00'){
      toast.error('La hora de inicio no puede ser mayor a las 22:00 o menor a las 6:00');
      return;
    }

    const reserva:ReservaDTO = {
      idUsuario: 1,
      idCliente: 3,
      estatus: 'Activo',
      detailReserva: {
        idDetailReser: 0, // Asumido, o eliminar si es autogenerado
        fecha: this.eventDate,
        horaInicio: this.eventStartTime,
        horaFin: this.eventEndTime,
        idEspacio: this.idEspacio
      },
      creditCard:{
        cardNumber: this.selectedCreditCard().cardNumber,
        expiryDate: this.selectedCreditCard().expiryDate,
        cvv: this.selectedCreditCard().cvv,
        cardHolderName: this.selectedCreditCard().cardHolderName,
        userId: this.UserService.userData().id,
        id: this.selectedCreditCard().id,
        estatus: 'Activo'
      }

    };
  
    this.eventService.addEvent(reserva).subscribe(
      () => {
        this.closeModal();
        // Actualizar el calendario o realizar alguna otra acción
      },
      (error) => {
        console.error('Error al agregar la reserva:', error);
      }
    );
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCard = this.creditCards().find((card) => card.id === parseInt(selectElement.value, 10));
    console.log('selectedCard', selectedCard);
    if (selectedCard) {
      this.selectedCreditCard.set(selectedCard);
    }
  }
    
}
