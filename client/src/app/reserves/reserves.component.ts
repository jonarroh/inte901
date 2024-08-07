import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FormComponent } from '../reserves/form/form.component';
import { PlaceComponent } from '../place/place.component';



@Component({
  selector: 'app-reserves',
  standalone: true,
  imports: [NavbarComponent, FormComponent, PlaceComponent, FormComponent],
  templateUrl: './reserves.component.html',
  styleUrl: './reserves.component.css'
})
export class ReservesComponent {

  

}
