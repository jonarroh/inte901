import { Component, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { UserService } from '~/app/home/services/user.service';
import { User } from '~/lib/types';
import { RouterModule } from '@angular/router';
import { GeolocationService } from '~/app/services/geolocation.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'admin-nav',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  userId: number;
  rol: string = '';
  usuariosServe = inject(UserService);
  usuario$: Observable<User>;

  constructor(private geoService: GeolocationService,private http: HttpClient) {
    this.userId = this.getUser();
    this.usuario$ = this.usuariosServe.getUser(this.userId);

    this.usuario$.subscribe((user) => {
      this.rol = user.role;
    });
  }

  getUser(){
    const userId = localStorage.getItem('userId') ?? '';
    return parseInt(userId);
  }

  private apiUrl = 'http://191.101.1.86:3000/location';
  logout(){
    let token = localStorage.getItem('token') ?? '';
    // from(this.http.delete(`${this.apiUrl}/${token}`)).subscribe({
    from(this.http.delete(`http:191.101.1.86:4200/${token}`)).subscribe({
      next: () => {
      },
      error: (error: any) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.geoService.location = null;
        location.href = '/';
        console.error('Error al cerrar sesión', error);
      },
      complete: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.geoService.location = null;
        location.href = '/';
        console.log('Sesión cerrada');
      }
    });

  }
}
