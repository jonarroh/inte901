import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '~/app/home/services/user.service';
import { User } from '~/lib/types';
import { RouterModule } from '@angular/router';

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

  constructor() {
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


  logout(){
    localStorage.clear();
    window.location.href = '/';
  }
}
