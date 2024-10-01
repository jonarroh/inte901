import { Component, Input } from '@angular/core';
import clsx from 'clsx';

@Component({
  standalone: true,
  selector: 'app-breadcrumb-separator',
  template: `
    <span [class]="clsx(separatorClass)">
      {{ separator }}
    </span>
  `
})
export class BreadcrumbSeparatorComponent {
  @Input() separator = '/';
  @Input() separatorClass = 'mx-2 text-gray-500';

  clsx = clsx;
}
