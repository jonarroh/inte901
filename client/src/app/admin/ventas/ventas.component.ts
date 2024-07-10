import { Component } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    NavComponent
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {

}
