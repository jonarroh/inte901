import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      // Si el usuario no está autenticado, redirigir a la página de login
      this.router.navigate(['/login']);
      toast.error('Inicia sesión para continuar');
      return false;
    }
    return true;
  }
}
