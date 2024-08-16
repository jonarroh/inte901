
import { Component, computed, effect, OnInit, Signal, signal, TrackByFunction } from '@angular/core';
import { NavbarComponent } from '~/app/home/navbar/navbar.component';
import { Espacio, Espacio2, EspacioDTO } from '~/lib/types';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '~/components/ui-dialog-helm/src';
import { LucideAngularModule } from 'lucide-angular';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { HlmLabelDirective } from '~/components/ui-label-helm/src';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective, HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { createFormField, createFormGroup, SignalInputDirective, V } from 'ng-signal-forms';
import { BrnSelectImports, BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { FormsModule } from '@angular/forms';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '~/components/ui-command-helm/src';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { CommonModule, DecimalPipe, NgForOf, TitleCasePipe } from '@angular/common';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '~/components/ui-menu-helm/src';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '~/components/ui-table-helm/src';
import { HlmCheckboxCheckIconComponent, HlmCheckboxComponent } from '~/components/ui-checkbox-helm/src';
import { SelectionModel } from '@angular/cdk/collections';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-estatus',
  standalone: true,
  imports: [
    NavbarComponent, HlmDialogComponent, HlmDialogContentComponent, HlmDialogFooterComponent,
    LucideAngularModule, BrnDialogContentDirective, BrnDialogTriggerDirective, HlmDialogHeaderComponent,
    HlmDialogTitleDirective,HlmDialogDescriptionDirective, HlmLabelDirective, HlmInputDirective, HlmButtonDirective,
    SignalInputDirective, BrnSelectImports, HlmSelectImports, FormsModule, BrnCommandImports, HlmCommandImports, HlmIconComponent,
    HlmButtonDirective, BrnPopoverComponent, BrnPopoverTriggerDirective, BrnPopoverTriggerDirective, BrnPopoverContentDirective,
    NgForOf, BrnMenuTriggerDirective, HlmMenuModule, BrnTableModule, HlmTableModule,HlmButtonModule, DecimalPipe, TitleCasePipe, HlmIconComponent,
    HlmInputDirective, HlmCheckboxCheckIconComponent, HlmCheckboxComponent, BrnSelectModule, HlmSelectModule, CommonModule
  ],
  templateUrl: './estatus.component.html',
  styleUrl: './estatus.component.css'
})
export class EstatusComponent {

  

}
