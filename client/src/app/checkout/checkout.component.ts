import { Component, signal, computed } from '@angular/core';
import { CheckoutService } from './checkout.service';
import { Order } from '~/lib/types';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { TarjetaComponent } from './tarjeta/tarjeta.component';
import { DetailsComponent } from './details/details.component';
import { DireccionComponent } from './direccion/direccion.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    NavbarComponent,
    TarjetaComponent,
    DetailsComponent,
    DireccionComponent,
    RouterModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  steps = [
    'address',
    'payment',
    'details'
  ];

  currentStep = signal(0);
  disabled = signal(false);

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    
  }

  
}
