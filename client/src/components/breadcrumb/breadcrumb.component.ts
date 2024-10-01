import { Component, Signal, computed, inject, Input } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreadcrumbItemComponent } from './breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbSeparatorComponent } from './breadcrumb-separator/breadcrumb-separator.component';
import clsx from 'clsx';

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  template: `
    <nav *ngIf="breadcrumbs().length > 0" [class]="clsx(navClass)">
      <ol class="inline-flex items-center">
        <li *ngFor="let breadcrumb of breadcrumbs(); let isLast = last" class="inline-flex items-center">
          <app-breadcrumb-item
            [label]="breadcrumb.label"
            [url]="breadcrumb.url"
            [isLast]="isLast"
            [baseClass]="itemBaseClass"
            [linkClass]="itemLinkClass"
            [lastClass]="itemLastClass">
          </app-breadcrumb-item>

          <app-breadcrumb-separator
            *ngIf="!isLast"
            [separator]="separator"
            [separatorClass]="separatorClass">
          </app-breadcrumb-separator>
        </li>
      </ol>
    </nav>
  `,
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    RouterModule,
    BreadcrumbItemComponent,
    BreadcrumbSeparatorComponent
  ]
})
export class BreadcrumbComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Inputs para los estilos y el separador
  @Input() navClass = 'flex items-center space-x-2';
  @Input() itemBaseClass = 'text-md';
  @Input() itemLinkClass = 'text-blue-600 hover:text-blue-800';
  @Input() itemLastClass = 'text-gray-500';
  @Input() separator = '/';
  @Input() separatorClass = 'mx-2 text-gray-500';

  breadcrumbs: Signal<{ label: string, url: string }[]> = computed(() => {
    const rootRoute = this.router.routerState.snapshot.root;
    const segments: { label: string, url: string }[] = [];
    let currentUrl = '';

    this.buildBreadcrumb(rootRoute, segments, currentUrl);
    return segments;
  });

  clsx = clsx;

  private buildBreadcrumb(route: any, segments: { label: string, url: string }[], currentUrl: string): void {
    if (route.routeConfig && route.routeConfig.data && Array.isArray(route.routeConfig.data['breadcrumb'])) {
      const breadcrumbsArray = route.routeConfig.data['breadcrumb'];

      breadcrumbsArray.forEach((breadcrumb: { label: string, route: string }) => {
        let routeUrl = breadcrumb.route;
        Object.keys(route.params).forEach(param => {
          routeUrl = routeUrl.replace(`:${param}`, route.params[param]);
        });

        currentUrl += `/${routeUrl}`;
        segments.push({
          label: breadcrumb.label,
          url: currentUrl
        });
      });
    }

    if (route.firstChild) {
      this.buildBreadcrumb(route.firstChild, segments, currentUrl);
    }
  }
}
