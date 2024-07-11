import { Component } from '@angular/core';

import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';
import { LucideAngularModule } from 'lucide-angular';
import { CartService } from './cart.service';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    LucideAngularModule,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    BrnSheetContentDirective,
    BrnSheetTriggerDirective
    
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor(private cartService: CartService) {}

  get items() {
    return this.cartService.getItems();
  }

}
