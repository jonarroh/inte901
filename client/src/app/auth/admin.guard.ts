import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../home/services/user.service';
import { Roles } from '~/lib/types';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router,private userService: UserService) {}

  canActivate(): boolean {
    const userData = this.userService.userData();
    const role = userData.role;
    console.log('role', role);
  
    const NotAllowedRoles = ['Cliente'];
    console.log('NotAllowedRoles', NotAllowedRoles.includes(role));
  
    if (!NotAllowedRoles.includes(role)) {
      return true;
    } else {
      this.router.navigate(['/']);
      console.log('No tienes permisos para acceder a esta página');
      console.log('Tu rol es:', role);
      return false;
    }
  }
  
}
