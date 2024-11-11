import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import {
  createFormField,
  createFormGroup,
  SignalInputDirective,
  V,
} from 'ng-signal-forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '~/app/auth/auth.service';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';

interface ResponseLogin {
  message?: string;
  jwtToken?: string;
}

import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { UserService } from '~/app/home/services/user.service';
import { toast } from 'ngx-sonner';
import { Usuario } from '~/app/admin/compras/interface/usuario';
import { GeolocationService } from '~/app/services/geolocation.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
@Component({
  selector: 'left-seccion',
  standalone: true,
  imports: [
    LucideAngularModule,
    FormsModule,
    HlmInputDirective,
    HlmButtonDirective,
    FormsModule,
    SignalInputDirective,
    RouterModule,
    CommonModule,
    RecaptchaModule,
  ],
  providers: [AuthService, Router, UserService, GeolocationService],
  templateUrl: './left-seccion.component.html',
})
export class LeftSeccionComponent implements OnInit {
  isOnline: boolean = true;
  captchaToken: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private geoService: GeolocationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.checkInternetConnection();
    window.addEventListener('online', this.checkInternetConnection.bind(this));
    window.addEventListener('offline', this.checkInternetConnection.bind(this));
  }

  checkInternetConnection() {
    this.isOnline = navigator.onLine;
  }

  onCaptchaResolved(captchaResponse: string) {
    this.captchaToken = captchaResponse;
    console.log(`Captcha token: ${captchaResponse}`);
  }

  disabled = signal(false);
  res = signal<ResponseLogin | null>(null);

  protected formModel = createFormGroup({
    username: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El nombre de usuario es requerido',
        },
        {
          validator: V.maxLength(50),
          message: 'El nombre de usuario debe tener menos de 50 caracteres',
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
  });

  login() {
    console.log('Login');
    console.log(this.formModel.value());
    console.log(this.formModel.valid());
    console.log(this.formModel.errors());

    // Verificar si se requiere reCAPTCHA y no está completo
    if (this.isOnline && !this.captchaToken) {
      toast.error('Por favor, complete el reCAPTCHA antes de iniciar sesión.');
      this.disabled.set(false);
      return;
    }

    if (this.formModel.valid()) {
      this.disabled.set(true);

      const loginData = {
        ...this.formModel.value(),
        captchaToken: this.captchaToken,
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          if (response.lastSession) {
            const lastSessionLocal = new Date(
              response.lastSession
            ).toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
            toast.success(
              `Bienvenido de regreso! Última conexión: ${lastSessionLocal}`
            );
          }

          // Eliminar la ubicación actual y los datos de autenticación previos
          this.geoService.deleteLocation(this.geoService.getAnonymousToken());
          localStorage.removeItem('anonymousToken');

          localStorage.setItem('token', response.jwtToken);
          localStorage.setItem('userId', response.id);

          this.userService.getUser(response.id).subscribe({
            next: (user) => {
              console.log('Usuario cargado correctamente', user);
              this.userService.saveUserData(user).then(() => {
                console.log('Usuario guardado');

                this.geoService.getCurrentPosition().then((position) => {
                  if (position) {
                    const deviceInfo = this.geoService.getDeviceName();
                    if (this.geoService.isLogged()) {
                      this.geoService.sendLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        isLogged: 1,
                        token: localStorage.getItem('token') || '',
                        browser: deviceInfo.browser,
                        deviceType: deviceInfo.deviceType,
                      });
                    }
                  }
                });

                if (user.role === 'Admin') {
                  this.router.navigate(['/admin/productos']);
                } else {
                  this.router.navigate(['/products']);
                }
              });
            },
            complete: () => {
              console.log(
                'Usuario cargado correctamente',
                this.userService.userData()?.id
              );
            },
            error: (error) => {
              console.error('Error al cargar el usuario', error);
            },
          });
        },
        error: (error) => {
          this.disabled.set(false);
          this.res.set(error.error);
          console.error(error.error.message);
          setTimeout(() => {
            this.res.set(null);
          }, 2000);
        },
        complete: () => {
          this.disabled.set(false);
        },
      });
    } else {
      console.error('Formulario no es válido:', this.formModel.errorsArray());
    }
  }
}
