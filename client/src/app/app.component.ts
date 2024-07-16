import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '../components/ui-button-helm/src/lib/hlm-button.directive';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonDirective, HlmToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client';

  onButtonClick() {
    console.log('Button clicked!');
  }
}
