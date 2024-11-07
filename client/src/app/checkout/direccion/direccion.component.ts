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
  templateUrl: './direccion.component.html',
  styleUrl: './direccion.component.css'
})
export class DireccionComponent {


  constructor(private userService: UserService,private CheackoutService: CheckoutService,private router: Router) {
    console.log('user', this.userService.userData);
  }

  onCreatedAddress() {

    console.log(this.formModel.valid());

    if(this.formModel.valid()) {
      const add = {
        calle: this.formModel.controls.calle.value(),
        ciudad: this.formModel.controls.ciudad.value(),
        codigoPostal: this.formModel.controls.codigoPostal.value(),
        colonia: this.formModel.controls.colonia.value(),
        numeroExterior: Number(this.formModel.controls.numeroExterior.value()),
        estado: 'Guanajuato',
        id: 0,
        pais: 'México',
        estatus: 'Activo',
        userId: Number(localStorage.getItem('userId'))
      } satisfies Address;
      console.log('Address', add);
      this.onClearForm();
      this.CheackoutService.createAddress(add).subscribe({
        next: () => {
          console.log('Address edited');
          this.userService.syncUserData();
          toast.success('Dirección creada correctamente');
        },
        error: (error) => {
          console.error('Error al editar la dirección', error);
          toast.error('Error al crear la dirección');
        }
      });
    }
  }
  protected formModel = createFormGroup({
    calle: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La calle es requerida',
        },
        {
          validator: V.maxLength(50),
          message: 'La calle debe tener menos de 50 caracteres',
        }
      ],
    }),
    ciudad: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La ciudad es requerida',
        },
        {
          validator: V.maxLength(50),
          message: 'La ciudad debe tener menos de 50 caracteres',
        }
      ],
    }),
    codigoPostal: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El código postal es requerido',
        },
        {
          validator: V.maxLength(6),
          message: 'El código postal debe tener menos de 6 caracteres',
        },
        {
          validator: V.pattern(/^\d+$/),
          message: 'El código postal debe ser un número',
        }
      ],
    }),
    colonia: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La colonia es requerida',
        },
        {
          validator: V.maxLength(50),
          message: 'La colonia debe tener menos de 50 caracteres',
        }
      ],
    }),
    numeroExterior: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El número exterior es requerido',
        },
        {
          validator: V.maxLength(10),
          message: 'El número exterior debe tener menos de 10 caracteres',
        }
      ],
    }),

  })
  onClearForm() {
    this.formModel.reset();
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
