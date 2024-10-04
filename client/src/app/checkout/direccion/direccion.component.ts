import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '~/app/home/services/user.service';
import { Address, CreditCard } from '~/lib/types';
import { CheckoutService } from '../checkout.service';
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';



@Component({
  selector: 'app-direccion',
  standalone: true,
  imports: [
    HlmAccordionContentDirective,
    HlmAccordionDirective,
    HlmAccordionIconDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    BrnAccordionContentComponent,
    HlmIconComponent,
    RouterModule,
    LucideAngularModule,
    BreadcrumbComponent
  ],
  templateUrl: './direccion.component.html',
  styleUrl: './direccion.component.css'
})
export class DireccionComponent {


  constructor(private userService: UserService,private CheackoutService: CheckoutService,private router: Router) {
    console.log('user', this.userService.userData);
  }

  user = this.userService.userData;


  onSelectdAddress(address: Address) {
    this.CheackoutService.selectedAddress.set(address as Address);
    this.CheackoutService.isOrderToStore.set(false);
    this.router.navigate(['checkout/payment']);
  }

  onOrderToStore() {
    this.CheackoutService.isOrderToStore.set(true);
    this.CheackoutService.selectedAddress.set({
      calle: 'aaaa',
      colonia: 'aaa',
      ciudad: 'aaa',
      codigoPostal: 'aaa',
      estado: 'aa',
      estatus: 'aaa',
      id: 0,
      numeroExterior:45,
      pais: 'aaa',
      userId: 0,
    } as Address);
    this.router.navigate(['checkout/payment']);
  }



}
