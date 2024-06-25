import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import {
  createFormField,
  createFormGroup,
  SignalInputDirective,
  V,
} from 'ng-signal-forms';


import { Router } from '@angular/router';
import { AuthService } from '~/app/auth/auth.service';

@Component({
  selector: 'left-seccion',
  standalone: true,
  imports: [
    FormsModule,
    HlmInputDirective,
    HlmButtonDirective,
    FormsModule,
    SignalInputDirective,
  ],
  providers: [AuthService, Router],
  templateUrl: './left-seccion.component.html'
})
export class LeftSeccionComponent {
  constructor(private authService: AuthService, private router: Router) {}

  protected formModel = createFormGroup({
    username: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El nombre de usuario es requerido',
        },
        {
          validator: V.minLength(4),
          message: 'El nombre de usuario debe tener al menos 4 caracteres',
        },
        {
          validator: V.maxLength(20),
          message: 'El nombre de usuario debe tener menos de 20 caracteres',
        },
        {
          validator: V.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
          message: 'El nombre de usuario debe de ser un correo electrónico',
        },
      ],
    }),
    password: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La contraseña es requerida',
        },
        {
          validator: V.minLength(8),
          message: 'La contraseña debe tener al menos 8 caracteres',
        },
        {
          validator: V.maxLength(20),
          message: 'La contraseña debe tener menos de 20 caracteres',
        },
      ],
    }),
  });

  login() {
    console.log(this.formModel.value());
    if (this.formModel.valid()) {
      console.log('Login');
      this.authService.login(this.formModel.value()).subscribe(
        (res) => {
          console.log('Login successful', res);
          this.router.navigate(['test']);
        },
        (error) => {
          console.error('Error during login', error);
        }
      );
    }
  }

}
