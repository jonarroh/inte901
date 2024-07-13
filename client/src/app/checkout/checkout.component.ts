import { Component, signal } from '@angular/core';
import { CheckoutService } from './checkout.service';
import { Order } from '~/lib/types';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { TarjetaComponent } from './tarjeta/tarjeta.component';
import { DetailsComponent } from './details/details.component';
import { DireccionComponent } from './direccion/direccion.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    NavbarComponent,
    TarjetaComponent,
    DetailsComponent,
    DireccionComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  steps = [
   'Dirección',
   'Tarjeta',
   'Detalles'
  ]

  constructor(private checkoutService: CheckoutService) { }


  currentStep = signal(0);

  nextStep() {
    if(!this.isLastStep()){
      this.currentStep.update(value => value + 1);
    }
  }

  get currentStepName() {
    return this.steps[this.currentStep()];
  }

  prevStep() {
    if(this.currentStep() > 0){
      this.currentStep.update(value => value - 1);
    }
  }

  isLastStep() {
    return this.currentStep() === this.steps.length - 1;
  }



}
