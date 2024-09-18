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

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const role = userData.role;

    console.log(`el rol es ${role}`);

    const allowdRoles = ['Admin'];
    if (allowdRoles.includes(role as Roles)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
