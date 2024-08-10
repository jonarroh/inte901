import { Component, computed, OnInit, Input, signal, input } from '@angular/core';
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
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '~/lib/types';

@Component({
  selector: 'nav-icon',
  standalone: true,
  imports: [
    RouterModule,
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
    HlmButtonDirective,
    RouterModule
  ],
  providers: [UserService],
  templateUrl: './icon.component.html'
})
export class IconComponent implements OnInit {

  
  isLogged = input.required()

  private userData = signal<User | null>(null);

  imgUrl  = this.userService.imgUrl;
  initials = computed(() => this.userData()?.name?.split(' ').map((name) => name[0]).join('') || '');

  constructor(private userService: UserService) {}

  ngOnInit() {
   if(this.isLog()) {

   
    this.userService.getUser(Number(localStorage.getItem('userId'))).subscribe({
      next: (user) => {
        this.userData.set(user);
      },
      complete: () => {
        console.log('Usuario cargado correctamente', this.userData()?.id);
      },
      error: (error) => {
        console.error('Error al cargar el usuario', error);
      }
    });
  }
}

isLog() {
  return !!localStorage.getItem('token');
}

  logout() {
    localStorage.removeItem('token');
  }
}
