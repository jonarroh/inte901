import { Component, signal } from '@angular/core';
import { UserService } from '~/app/home/services/user.service';
import { CheckoutService } from '../checkout.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { LucideAngularModule } from 'lucide-angular';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';

import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { NgForOf } from '@angular/common';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';
import {
  createFormField,
  createFormGroup,
  SignalInputDirective,
  V,
} from 'ng-signal-forms';
import { Address, CreditCard, CreditCardWithCvv } from '~/lib/types';
import { NavComponent } from '~/app/admin/componentes/nav/nav.component';
import { NavbarComponent } from "../../home/navbar/navbar.component";
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [
    NavComponent,
    NavbarComponent,
    LucideAngularModule,
    HlmButtonDirective,
    HlmInputDirective,
    SignalInputDirective,
    FormsModule,
    BrnCommandImports,
    HlmCommandImports,
    HlmIconComponent,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    NgForOf,
    BrnAlertDialogContentDirective,
    BrnAlertDialogTriggerDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogContentComponent,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogTitleDirective,
  ],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent {

  constructor(private userService: UserService,private CheackoutService: CheckoutService,private router: Router) {}

  user = this.userService.userData;
  currentCard = signal<CreditCard | undefined>(undefined);

  isEdit = signal(false);

  onEdit() {

    const card: CreditCard = {
      cardHolderName: this.form.controls.cardHolderName.value(),
      cardNumber: this.form.controls.cardNumber.value(),
      expiryDate: this.form.controls.expiryDate.value(),
      id: this.currentCard()!.id,
      estatus: 'Activo',
      cvv: this.form.controls.cvv.value(),
      userId: localStorage.getItem('userId') as unknown as number,
    };


    this.CheackoutService.editCard(card).subscribe({
      next: () => {
        this.onClearForm();
        this.userService.syncUserData();
        this.isEdit.set(false);
        toast.success('Tarjeta editada');
      },
      error: () => {
        toast.error('Error al editar la tarjeta');
      }
    });
  }

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

  onDelete(card: CreditCard) {
    this.CheackoutService.deleteCard(card.id).subscribe({
      next: () => {
        this.userService.syncUserData();
        toast.success('Tarjeta eliminada');
      },
      error: () => {
        toast.error('Error al eliminar la tarjeta');
      }
    })
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

  putSlahInExpiryDate() {
    const value = this.form.controls.expiryDate.value;
    console.log(value);
    if (value().length === 2) {
      this.form.controls.expiryDate.value.update(value => value + '/');
    }
  }

  onClickEdit(card: CreditCard) {
    this.currentCard.set(card);
    this.isEdit.set(true);
    this.form.controls.cardHolderName.value.set(card.cardHolderName);
    this.form.controls.cardNumber.value.set(card.cardNumber);
    this.form.controls.expiryDate.value.update(value => {
      const [month, year] = card.expiryDate.split('/');
      return `${month}/${year.slice(-2)}`;
    })
    this.form.controls.cvv.value.set('');

  }
  isFlipped = signal(false);

  flipCard(isFlipped: boolean) {
    this.isFlipped.set(isFlipped);
  }


  onClearForm() {
    this.form.reset();
  }
  


}
