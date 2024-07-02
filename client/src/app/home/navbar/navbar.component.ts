import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { IconComponent } from '../icon/icon.component';



@Component({
  selector: 'home-navbar',
  standalone: true,
  imports: [
    HlmInputDirective,
    LucideAngularModule,
    IconComponent
  
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  constructor() { }

  isLogged() {
    return !!localStorage.getItem('token');
  }




}
