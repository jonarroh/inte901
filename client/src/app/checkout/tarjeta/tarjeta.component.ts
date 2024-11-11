import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '~/app/home/services/user.service';
import { CheckoutService } from '../checkout.service';
import { Router, RouterModule } from '@angular/router';
import { CreditCard, CreditCardWithCvv } from '~/lib/types';
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective
} from '@spartan-ng/ui-sheet-helm';
import {
  createFormField,
  createFormGroup,
  SignalInputDirective,
  V,
} from 'ng-signal-forms';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterModule,
    BreadcrumbComponent,
    HlmSheetFooterComponent,
    HlmSheetHeaderComponent,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    BrnSheetContentDirective,
    BrnSheetTriggerDirective,
    FormsModule,
    SignalInputDirective

  ],
  templateUrl: './tarjeta.component.html',
  styleUrl: './tarjeta.component.css'
})
export class TarjetaComponent {

  constructor(private userService: UserService,private CheackoutService: CheckoutService,private router: Router) {
    console.log('user', this.userService.userData);
  }
  putSlahInExpiryDate() {
    const value = this.form.controls.expiryDate.value;
    console.log(value);
    if (value().length === 2) {
      this.form.controls.expiryDate.value.update(value => value + '/');
    }
  }

  obscureCardNumber(cardNumber: string) {
    return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);	
  }

  protected form = createFormGroup({
    cardHolderName: createFormField('',{
      validators: [V.required()],
    }),
    cardNumber: createFormField('',{
      validators: [V.required()],
    }),
    expiryDate: createFormField('',{
      validators: [V.required()],
    }),
    cvv: createFormField('',{
      validators: [V.required()],
    }),
  })
  onSave() {
    const card: CreditCardWithCvv = {
      cardHolderName: this.form.controls.cardHolderName.value(),
      cardNumber: this.form.controls.cardNumber.value(),
      expiryDate: this.form.controls.expiryDate.value(),
      id: 0,
      estatus: 'Activo',
      cvv: this.form.controls.cvv.value(),
      userId: localStorage.getItem('userId') as unknown as number,
    };

    this.CheackoutService.createCard(card).subscribe({
      next: () => {
        this.userService.syncUserData();
        toast.success('Tarjeta guardada');
        this.onClearForm();
      },
      error: () => {
        toast.error('Error al guardar la tarjeta');
      }
    })
    
  }
  onClearForm() {
    this.form.reset();
  }
  isFlipped = signal(false);

  flipCard(isFlipped: boolean) {
    this.isFlipped.set(isFlipped);
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
