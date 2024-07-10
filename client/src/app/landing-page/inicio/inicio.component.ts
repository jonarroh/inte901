import { Component } from '@angular/core';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HlmButtonDirective],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
