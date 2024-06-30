import { Component } from '@angular/core';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    LucideAngularModule,
    HlmButtonDirective
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
