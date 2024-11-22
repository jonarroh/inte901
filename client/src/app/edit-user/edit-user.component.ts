import { Component, computed, signal } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import {
  createFormField,
  createFormGroup,
  SignalInputDirective,
  V,
} from 'ng-signal-forms';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Router } from 'lucide-angular';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { UserService } from '../home/services/user.service';
import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';
import { UserEditDTO } from '~/lib/types';

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
import { toast } from 'ngx-sonner';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    SignalInputDirective,
    LucideAngularModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogContentComponent,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogCancelButtonDirective,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    RouterModule,
    BreadcrumbComponent
  ],
  providers: [
    UserService
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {

  user = this.userService.userData();

  constructor(private userService: UserService) {
    
  }

  imgUrl = this.userService.imgUrl;
  initials = computed(() => this.userService.userData()?.name?.split(' ').map((name) => name[0]).join('') || '');
  ImageFile = signal<File | undefined>(undefined);
  disabled = signal(false);
  isUpdatedImage = signal(false);
  newImage = signal<string | null>(null);


  protected formModel = createFormGroup({
    name: createFormField(this.userService.userData()?.name || '', {
      validators: [
        {
          validator: V.required(),
          message: 'El nombre es requerido',
        },
        {
          validator: V.maxLength(50),
          message: 'El nombre debe tener menos de 50 caracteres',
        }
      ],
    }),
    password: createFormGroup(()=>{
      const actualPassword = createFormField('', {
      });
      const newPassword = createFormField('', {
        
      });
      const confirmPassword = createFormField('', {
        validators: [
          {
            validator: V.equalsTo(newPassword.value),
          }
        ],
      });
      return {
        actualPassword,
        newPassword,
        confirmPassword
      }
    }),
    email: createFormField(this.userService.userData()?.email || '', {
      validators: [
        {
          validator: V.required(),
          message: 'El email es requerido',
        },
        {
          validator: V.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
          message: 'El email no es valido',
        }
      ],
    }),
    lastName: createFormField(this.userService.userData()?.lastName || '', {
      validators: [
        {
          validator: V.required(),
          message: 'El apellido es requerido',
        },
        {
          validator: V.maxLength(50),
          message: 'El apellido debe tener menos de 50 caracteres',
        }
      ],
    })
  });


  onImageChange(event: Event) {
    this.ImageFile.set((event.target as HTMLInputElement).files![0]);
    this.userService.editTempImage((event.target as HTMLInputElement).files![0]);
  }

  onSaveData() {
console.log(`isDesabled: ${this.disabled()}`);

    const UserEditDTO: UserEditDTO = {
      actualPassword: this.formModel.controls.password.controls.actualPassword.value(),
      email: this.formModel.controls.email.value(),
      id: this.userService.userData()!.id,
      lastName: this.formModel.controls.lastName.value(),
      name: this.formModel.controls.name.value(),
      newPassword: this.formModel.controls.password.controls.newPassword.value(),
      creditCards: this.userService.userData()!.creditCards,
      direcciones: this.userService.userData()!.direcciones,
      Image: this.ImageFile(),
    };
    if(this.formModel.valid()){
      this.userService.updateUser(UserEditDTO).subscribe({
        next: (user) => {
          this.userService.saveUserData(user);
          this.isUpdatedImage.set(false);
          toast('Usuario actualizado correctamente', {  });
          this.formModel.reset();
          
        },
        error: (error) => {
          console.error('Arregla los errores para continuar', error);
        }
      });
    }else{
      toast.error('Error al actualizar el usuario', {  });
    }
  }

  


}
