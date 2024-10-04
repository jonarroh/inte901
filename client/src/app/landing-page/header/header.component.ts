import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterModule
  ],
  providers: [
    RouterModule 
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  constructor() { }

  ngAfterViewInit() {
    const headerEl = document.querySelector("#landing-header") as HTMLElement;
    const logoPng = document.querySelector('#logo-png') as HTMLImageElement;
    const logoWebp = document.querySelector('#logo-webp') as HTMLImageElement;

    if (headerEl && logoPng && logoWebp) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { isIntersecting } = entry;
          if (isIntersecting) {
            const color = entry.target.getAttribute("data-header-color");
            if (color === 'black') {
              logoPng.style.display = 'block';
              logoWebp.style.display = 'none';
            } else if (color === 'white') {
              logoPng.style.display = 'none';
              logoWebp.style.display = 'block';
            }
            headerEl.style.color = color ?? '';
          }
        });
      }, observerOptions);

      const sectionsElements = document.querySelectorAll(".landing-section");
      sectionsElements.forEach((section) => observer.observe(section));
    } else {
      console.error("Header or logo elements not found!");
    }
  }




}
