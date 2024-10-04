import { Component, Input, } from '@angular/core';
import clsx from 'clsx';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-breadcrumb-item',
  imports: [CommonModule,RouterModule],
  template: `
    <a *ngIf="!isLast; else lastBreadcrumb"
       [routerLink]="url"
       [class]="clsx(baseClass, linkClass)">
      {{ label }}
    </a>
    <ng-template #lastBreadcrumb>
      <span [class]="clsx(baseClass, lastClass)">
        {{ label }}
      </span>
    </ng-template>
  `
})
export class BreadcrumbItemComponent {
  @Input() label!: string;
  @Input() url?: string;
  @Input() isLast = false;
  @Input() baseClass = 'text-md';
  @Input() linkClass = 'text-blue-600 hover:text-blue-800';
  @Input() lastClass = 'text-gray-500';

  clsx = clsx;
}
