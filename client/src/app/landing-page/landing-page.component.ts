import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { SectionProdComponent } from './section-prod/section-prod.component';
import { InicioComponent } from './inicio/inicio.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, HlmButtonDirective, SectionProdComponent, InicioComponent],
})
export class LandingPageComponent {

}
