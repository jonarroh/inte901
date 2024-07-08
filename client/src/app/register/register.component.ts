import { Component } from '@angular/core';
import { FormComponent } from './form/form.component';
import { RightSeccionComponent } from '../login/right-seccion/right-seccion.component';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'RegisterComponent',
  standalone: true,
  imports: [
    FormComponent,
    RightSeccionComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}

