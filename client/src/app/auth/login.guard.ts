import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../home/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private userService: UserService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Si el usuario está autenticado, redirigir a una página específica (por ejemplo, 'test')
      const user = this.userService.userData();
      if(user.role === 'Admin'){
        console.log('es admin');
        console.log(user.role);
        this.router.navigate(['/admin/productos']);
      }else{
        this.router.navigate(['/products']);
      }

      return false;
    }
    return true;
  }
}
