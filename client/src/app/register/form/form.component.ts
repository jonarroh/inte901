import { Component, OnInit, signal } from '@angular/core';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import {
  SignalInputDirective,
  V,
  createFormField,
  createFormGroup,
} from 'ng-signal-forms';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { es } from 'date-fns/locale';
import { User } from '~/lib/types';
import { toast } from 'ngx-sonner';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'FormComponent',
  standalone: true,
  imports: [
    HlmInputDirective,
    FormsModule,
    SignalInputDirective,
    LucideAngularModule,
    RecaptchaModule,
    CommonModule,
  ],
  providers: [RegisterService, Router],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  isOnline: boolean = true;
  captchaToken: string = '';

  ngOnInit() {
    this.checkInternetConnection();
    window.addEventListener('online', this.checkInternetConnection.bind(this));
    window.addEventListener('offline', this.checkInternetConnection.bind(this));
  }

  constructor(private registerServe: RegisterService, private router: Router) {} //

  checkInternetConnection() {
    this.isOnline = navigator.onLine;
  }

  onCaptchaResolved(captchaResponse: string) {
    this.captchaToken = captchaResponse;
    console.log(`Captcha token: ${captchaResponse}`);
  }

  disabled = signal(false);

  protected formModel = createFormGroup({
    name: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El nombre es requerido',
        },
        {
          validator: V.maxLength(80),
          message: 'El nombre debe tener menos de 80 caracteres',
        },
      ],
    }),
    lastname: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'Los apellidos son requeridos',
        },
        {
          validator: V.maxLength(100),
          message: 'Los apellidos deben tener menos de 100 caracteres',
        },
      ],
    }),
    email: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El correo es requerido',
        },
        {
          validator: V.maxLength(50),
          message: 'El correo debe tener menos de 50 caracteres',
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
          validator: V.maxLength(20),
          message: 'La contraseña debe tener menos de 20 caracteres',
        },
      ],
    }),
    dob: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La fecha de nacimiento es requerida',
        },
      ],
    }),
  });

  register() {
    console.log('Register');
    console.log(this.formModel.value());
    console.log(this.formModel.valid());
    console.log(this.formModel.errors());

    this.disabled.set(true);
    //si la fecha de nacimiento es invalida mostrar un mensaje de error con toast

    // Verificar si se requiere reCAPTCHA y no está completo
    if (this.isOnline && !this.captchaToken) {
      toast.error('Por favor, complete el reCAPTCHA antes de registrarse.');
      this.disabled.set(false);
      return;
    }

    // Verificar si se requiere reCAPTCHA y no está completo
    if (navigator.onLine && !this.captchaToken) {
      toast.error('Por favor, complete el reCAPTCHA antes de registrarse.');
      this.disabled.set(false);
      return;
    }

    this.finalizeRegistration(this.captchaToken);

    /*const today = new Date();
    const dob = new Date(this.formModel.controls.dob.value());
    if (dob > today) {
      toast.error(
        'La fecha de nacimiento no puede ser mayor a la fecha actual'
      );
      this.disabled.set(false);
      return;
    }

    const user: User = {
      creditCards: [],
      direcciones: [],
      estatus: 'Activo',
      email: this.formModel.controls.email.value(),
      id: 0,
      lastName: this.formModel.controls.lastname.value(),
      name: this.formModel.controls.name.value(),
      password: this.formModel.controls.password.value(),
      role: 'Cliente',
      token: '',
    };

    console.log(user);

    if (this.formModel.valid()) {
      this.registerServe.registerUser(user, this.captchaToken).subscribe({
        next: (response) => {
          console.log(response);
          console.log('Usuario registrado correctamente');
          toast.success('Usuario registrado correctamente');

          this.router.navigate(['/login']);
        },
        error: (error) => {
          const errorMessage = error?.error || 'Error al registrar el usuario';
          toast.error(errorMessage);
          this.disabled.set(false); // para que no le pueda dar al boton de clic
          console.error(error);
        },
        complete: () => {
          this.disabled.set(false);
        },
      });
    }*/
  }

  finalizeRegistration(captchaToken: string) {
    const today = new Date();
    const dob = new Date(this.formModel.controls.dob.value());
    if (dob > today) {
      toast.error(
        'La fecha de nacimiento no puede ser mayor a la fecha actual'
      );
      this.disabled.set(false);
      return;
    }

    const user: User = {
      creditCards: [],
      direcciones: [],
      estatus: 'Activo',
      email: this.formModel.controls.email.value(),
      id: 0,
      lastName: this.formModel.controls.lastname.value(),
      name: this.formModel.controls.name.value(),
      password: this.formModel.controls.password.value(),
      role: 'Cliente',
      token: '',
    };

    console.log(user);

    if (this.formModel.valid()) {
      this.registerServe.registerUser(user, captchaToken).subscribe({
        next: (response) => {
          console.log(response);
          console.log('Usuario registrado correctamente');
          toast.success('Usuario registrado correctamente');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const errorMessage = error?.error || 'Error al registrar el usuario';
          toast.error(errorMessage);
          this.disabled.set(false);
          console.error(error);
        },
        complete: () => {
          this.disabled.set(false);
        },
      });
    }
  }
}
