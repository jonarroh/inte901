import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HlmButtonDirective, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
