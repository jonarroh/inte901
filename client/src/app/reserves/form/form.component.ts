import { Component } from '@angular/core';
import { RightSeccionComponent } from '~/app/login/right-seccion/right-seccion.component';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormsModule } from '@angular/forms';
import { SignalInputDirective } from 'ng-signal-forms';
import { LucideAngularModule } from 'lucide-angular';



@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
  FormComponent,RightSeccionComponent,HlmInputDirective,
    FormsModule,SignalInputDirective,LucideAngularModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

}
