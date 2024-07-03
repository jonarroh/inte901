import { Component } from '@angular/core';
import {input} from '@angular/core'
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
import { LucideAngularModule } from 'lucide-angular';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';

import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';



@Component({
  selector: 'nav-icon',
  standalone: true,
  imports: [
    LucideAngularModule,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    HlmMenuShortcutComponent,
    HlmSubMenuComponent,
    BrnMenuTriggerDirective,
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
  ],
  templateUrl: './icon.component.html'
})
export class IconComponent {

  isLogged = input.required<boolean>();


  logout() {
    localStorage.removeItem('token');
  }

}
