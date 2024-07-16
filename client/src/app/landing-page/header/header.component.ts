import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LucideAngularModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor() {

        const headerEl = document.querySelector("#landing-header") as HTMLElement
        console.log(headerEl)
        console.log("Hola") 
        
        const observerOptions = {
            root: null,
            rootMargin: '0px', 
            threshold: 0.6,
        }
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const {isIntersecting} = entry 
                if (isIntersecting) {
                    const color = entry.target.getAttribute("data-header-color")
                    console.log(color)
                    headerEl.style.color = color ?? '';
                }
            })
        }, observerOptions)
    
        const sectionsElements = document.querySelectorAll(".landing-section")
        sectionsElements.forEach((section) => observer.observe(section))
  }
}
