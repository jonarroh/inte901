import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { toast } from 'ngx-sonner';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CanPayGuard implements CanActivate {
  constructor(private cartServive: CartService, private router: Router) {}

  canActivate(): boolean {
    const totalProducts = this.cartServive.getItems().length;

    if (totalProducts === 0) {
      this.router.navigate(['/products']);
      toast.error('No tienes productos en el carrito');
      return false;
    }
    return true;
  }
}
