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
    LucideAngularModule
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
    this.CheackoutService.selectdAddress.set(address as Address);
    this.CheackoutService.isOrderToStore.set(false);
    this.router.navigate(['checkout/payment']);
  }

  onOrderToStore() {
    this.CheackoutService.isOrderToStore.set(true);
    this.CheackoutService.selectedCard.set({} as CreditCard);
    this.router.navigate(['checkout/payment']);
  }



}
