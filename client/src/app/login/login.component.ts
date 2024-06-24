import { Component, signal } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import {
  createFormField,
  createFormGroup,
  SignalInputDirective,
  V,
} from 'ng-signal-forms';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'LoginComponent',
  standalone: true,
  imports: [
    HlmInputDirective,
    HlmButtonDirective,
    FormsModule,
    SignalInputDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService, Router],
})
export class LoginComponent {
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
