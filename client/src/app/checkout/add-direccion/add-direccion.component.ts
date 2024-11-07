import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CheckoutService } from '../checkout.service';
import { UserService } from '~/app/home/services/user.service';
import { Address } from '~/lib/types';
import { NavComponent } from '~/app/admin/componentes/nav/nav.component';
import { NavbarComponent } from "../../home/navbar/navbar.component";
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
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import {AutoAnimateModule,AutoAnimateDirective} from '@formkit/auto-animate/angular'
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';
 
type Estados = { label: string; value: string }

@Component({
  selector: 'app-add-direccion',
  standalone: true,
  imports: [
    NavComponent,
    NavbarComponent,
    LucideAngularModule,
    HlmButtonDirective,
    HlmInputDirective,
    SignalInputDirective,
    FormsModule,
    
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
    RouterModule,
    BreadcrumbComponent,
    
    
],
  templateUrl: './add-direccion.component.html',
  styleUrl: './add-direccion.component.css'
})
export class AddDireccionComponent {

  constructor(private userService: UserService,private CheackoutService: CheckoutService,private router: Router) {}

  address = this.userService.userData;
  currentAdress = signal<Address | undefined>(undefined);

  isEdit = signal(false);

  


  onEditAddress() {

    if(this.formModel.valid()) {
      const add = {
        calle: this.formModel.controls.calle.value(),
        ciudad: this.formModel.controls.ciudad.value(),
        codigoPostal: this.formModel.controls.codigoPostal.value(),
        colonia: this.formModel.controls.colonia.value(),
        numeroExterior: Number(this.formModel.controls.numeroExterior.value()),
        estado: 'Guanajuato',
        id: this.currentAdress()?.id,
        pais: 'México',
        userId: this.currentAdress()?.userId,
        estatus: 'Activo'
      } as Address;
      console.log('Address', add);
      this.onClearForm();
      this.CheackoutService.editAddress(add).subscribe({
        next: () => {
          console.log('Address edited');
          this.userService.syncUserData();
          toast.success('Dirección editada correctamente');
        },
        error: (error) => {
          console.error('Error al editar la dirección', error);
          toast.error('Error al editar la dirección');
        }
      });
    }

  }

  onDeleteAddress(address: Address) {
    this.CheackoutService.deleteAddress(address.id).subscribe({
      next: () => {
        console.log('Address deleted');
        this.userService.syncUserData();
        toast.success('Dirección eliminada correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar la dirección', error);
        toast.error('Error al eliminar la dirección');
      }
    });
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

  disabled = signal(false);

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


  onClickEdit(address: Address) {
    console.log('Edit', address);
    this.formModel.controls.calle.value.set(address.calle);
    this.formModel.controls.ciudad.value.set(address.ciudad);
    this.formModel.controls.codigoPostal.value.set(address.codigoPostal);
    this.formModel.controls.colonia.value.set(address.colonia);
    this.formModel.controls.numeroExterior.value.set(String(address.numeroExterior));
    this.isEdit.set(true);
    this.currentAdress.set(address);
  }

  onClearForm() {
    this.formModel.reset();
    this.isEdit.set(false);
    this.currentAdress.set(undefined);
  }
  

}
