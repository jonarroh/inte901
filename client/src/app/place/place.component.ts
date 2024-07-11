import { Component } from '@angular/core';
import { DescriptionPlaceComponent } from './description-place/description-place.component';
import { GaleryPlaceComponent } from './galery-place/galery-place.component';
import { NavbarComponent } from '../home/navbar/navbar.component';

@Component({
  selector: 'app-place',
  standalone: true,
  imports: [
    DescriptionPlaceComponent, GaleryPlaceComponent, NavbarComponent
  ],
  templateUrl: './place.component.html',
  styleUrl: './place.component.css'
})
export class PlaceComponent {

}
