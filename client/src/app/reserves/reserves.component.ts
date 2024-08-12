import { Component, signal } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FormComponent } from '../reserves/form/form.component';
import { PlaceComponent } from '../place/place.component';
import { UserService } from '../home/services/user.service';
import { CreditCard } from '~/lib/types';



@Component({
  selector: 'app-reserves',
  standalone: true,
  imports: [NavbarComponent, FormComponent, PlaceComponent, FormComponent],
  providers: [],
  templateUrl: './reserves.component.html',
  styleUrl: './reserves.component.css'
})
export class ReservesComponent {

 
  

}
