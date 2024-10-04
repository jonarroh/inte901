import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'nav-reserve',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterModule
  ],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css',
  providers: [
    Router
  ]
})
export class ReserveComponent {

}
