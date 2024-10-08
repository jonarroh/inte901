import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '~/app/home/services/user.service';
import { CheckoutService } from '../checkout.service';
import { Router, RouterModule } from '@angular/router';
import { CreditCard } from '~/lib/types';
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterModule,
    BreadcrumbComponent

  ],
  templateUrl: './tarjeta.component.html',
  styleUrl: './tarjeta.component.css'
})
export class TarjetaComponent {

  constructor(private userService: UserService,private CheackoutService: CheckoutService,private router: Router) {
    console.log('user', this.userService.userData);
  }

  selectedCard = signal<CreditCard>({} as CreditCard);
  isEffect = signal(false);

  user = this.userService.userData;

  onSelectdCard(card: CreditCard) {
    this.CheackoutService.selectedCard.set(card as CreditCard);
    console.log('selectedCard', this.CheackoutService.selectedCard());
    this.CheackoutService.isPaidWithCard.set(true);
    this.router.navigate(['checkout/details']);
  }

  obscureCard(cardNumber: string) {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  onOrderToStore() {
    this.CheackoutService.isPaidWithCard.set(false);
    this.CheackoutService.selectedCard.set({
      cardHolderName: 'na',
      cardNumber: '00',
      estatus: 'Activo',
      expiryDate: '12/45',
      id: 0,
      userId: 0,
      cvv: '000'
    }as CreditCard);
    this.router.navigate(['checkout/details']);
  }
}
