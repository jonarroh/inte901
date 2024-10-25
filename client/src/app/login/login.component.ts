import { Component, signal } from '@angular/core';

import { RightSeccionComponent } from './right-seccion/right-seccion.component';
import { LeftSeccionComponent } from './left-seccion/left-seccion.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'LoginComponent',
  standalone: true,
  imports: [
   
    RightSeccionComponent,
    LeftSeccionComponent,
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  
  constructor(private http: HttpClient) {}
    
  
}
