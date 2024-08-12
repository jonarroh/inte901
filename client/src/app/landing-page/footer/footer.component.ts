import { Component } from '@angular/core';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    LucideAngularModule,
    HlmButtonDirective,
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
