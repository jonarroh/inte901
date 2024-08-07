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
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  constructor() { }

  ngAfterViewInit() {
    const headerEl = document.querySelector("#landing-header") as HTMLElement;
    console.log(headerEl);
    console.log("Hola");

    if (headerEl) {
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
            console.log(color);
            headerEl.style.color = color ?? '';
          }
        });
      }, observerOptions);

      const sectionsElements = document.querySelectorAll(".landing-section");
      sectionsElements.forEach((section) => observer.observe(section));
    } else {
      console.error("Header element not found!");
    }
  }
}
