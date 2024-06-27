import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TestComponent } from './test/test.component';
import { AuthGuard } from './auth/login.guard';
import { AuthenticatedGuard } from './auth/route.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard], // Este guardia redirige a los usuarios autenticados fuera del login
  },
  {
    path: 'test',
    component: TestComponent,
    canActivate: [AuthenticatedGuard], // Este guardia protege las rutas autenticadas
  },
  // {
  //   path: '',
  //   redirectTo: '/login',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: LandingPageComponent
  },
  // Otras rutas
];
