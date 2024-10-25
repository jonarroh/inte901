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

  private apiUrl = 'http://localhost:3000/location';
  logout(){
    let token = localStorage.getItem('token') ?? '';
    from(this.http.delete(`${this.apiUrl}/${token}`)).subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.geoService.location = null;
      },
      error: (error: any) => {
        console.error('Error al cerrar sesión', error);
      }
    });

  }
}
