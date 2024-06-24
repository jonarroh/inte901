import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Si el usuario está autenticado, redirigir a una página específica (por ejemplo, 'test')
      this.router.navigate(['/test']);
      return false;
    }
    return true;
  }
}
