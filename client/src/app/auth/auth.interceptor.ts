// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

function getCookie(name: string): string | null {
  const match = localStorage.getItem('token')
  return match ? match : null;
}

function isTokenExpired(token: string): boolean {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log(`el token expira en: ${payload.exp * 1000}`);
  return Date.now() >= payload.exp * 1000;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getCookie('token');

  if (token) {
    if (isTokenExpired(token)) {
      const router = inject(Router);
      router.navigate(['/login']);
      return new Observable<HttpEvent<any>>(() => {});
    } else {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedRequest);
    }
  }

  return next(req);
};
