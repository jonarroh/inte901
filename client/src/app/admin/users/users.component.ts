
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogFooterComponent,
  HlmDialogService,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { toast } from 'ngx-sonner';
import { UserService } from '~/app/home/services/user.service';
import {
  createFormField,
  createFormGroup,
  SignalInputDirective,
  V,
} from 'ng-signal-forms';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmDialogModule } from "../../../components/ui-dialog-helm/src/index";
import { HlmCaptionComponent } from "../../../components/ui-table-helm/src/lib/hlm-caption.component";
import { FormsModule } from '@angular/forms';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { NgForOf } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import {  TrackByFunction, computed, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { lucideArrowUpDown, lucideChevronDown, lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxCheckIconComponent, HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { es, th } from 'date-fns/locale';


type RoleO = {
  value: string;
  label: string;
}


import { Component, HostBinding, inject } from "@angular/core";
import { provideIcons } from "@ng-icons/core";
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";
import { BrnDialogContentDirective, BrnDialogRef, BrnDialogTriggerDirective, injectBrnDialogContext } from "@spartan-ng/ui-dialog-brain";

import { lucideChevronsUpDown, lucideCheck, lucideSearch } from '@ng-icons/lucide';
import { HlmDialogDescriptionDirective, HlmDialogHeaderComponent, HlmDialogTitleDirective } from "~/components/ui-dialog-helm/src";
import { HlmIconComponent } from "~/components/ui-icon-helm/src";
import { User, UserEditDTO } from "~/lib/types";


@Component({
  selector: 'app-users',
  imports: [
    LucideAngularModule,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,

    HlmLabelDirective,
    HlmInputDirective,
    HlmButtonDirective,

    SignalInputDirective,
    BrnSelectImports, HlmSelectImports,
    FormsModule,
    
    HlmCommandImports,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    NgForOf,
    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,

    DecimalPipe,
    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,

    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,

    BrnSelectModule,
      HlmSelectModule,
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true,
  providers:[provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck, lucideChevronDown, lucideMoreHorizontal, lucideArrowUpDown })],
  
})
export class UsersComponent {

  
  isLoading = signal(false);
  role = '';

  roles = [
    { value: 'Admin', label: 'Administrador' },
    { value: 'Inventario', label: 'Inventario' },
    { value: 'Cocina', label: 'Cocina' },
    { value: 'Caja', label: 'Caja' },
    { value: 'Repartidor', label: 'Repartidor' }
  ]

  currentRole = signal<RoleO | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');
  public states = signal<'closed' | 'open'>('closed');

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  commandSelected(Role: RoleO) {
    this.state.set('closed');
    if (this.currentRole()?.value === Role.value) {
      this.currentRole.set(undefined);
    } else {
      this.currentRole.set(Role);
    }
  }

  protected formModel = createFormGroup({
    name: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El nombre es requerido'
        }
      ]
    }),
    lastName: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El apellido es requerido'
        }
      ]
    }),
    password: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La contraseña es requerida'
        }
      ]
    }),
    email: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El email es requerido'
        },
        {
          validator: V.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
          message: 'El email no es válido'
        }
      ]
    }),
    id: createFormField(0,{
      hidden: () => true
    }),
  });

  constructor(private userService:UserService) {
    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this._users.set(users);
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
      }
    });
  }


  onAddUser(newUser: User) {
    this.userService.createUser(newUser).subscribe({
      next: (user) => {
        console.log('Usuario creado correctamente', user);
        toast.success('Usuario creado correctamente');
        this.formModel.reset();
        this.currentRole.set(undefined);
      },
      error: (error) => {
        console.error('Error al crear el usuario', error);
        toast.error('Error al crear el usuario');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    })
  }

  onSubmit() {
    if(this.formModel.valid()) {
      const newUser:User = {
        creditCards: [],
        direcciones: [],
        email: this.formModel.controls.email.value(),
        estatus: 'Activo',
        id: 0,
        lastName: this.formModel.controls.lastName.value(),
        name: this.formModel.controls.name.value(),
        password: this.formModel.controls.password.value(),
        role: this.currentRole()?.value || 'Admin',
        token: ''
      } as User;
  
      this.isLoading.set(true);
      this.onAddUser(newUser);
    }
    else {
      this.formModel.markAllAsTouched();
      toast.error('Por favor, llena todos los campos');
    }
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<User>(true);
  protected readonly _isUserSelected = (user: User) => this._selectionModel.isSelected(user);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(() => this._selectionModel.selected)),{
      initialValue: []
    }
  );
  
  protected readonly _brnColumnManager = useBrnColumnManager({
    Name: {visible: true, label: 'Nombre', sortable: true},
    Email: {visible: true, label: 'Email', sortable: true},
    Role: {visible: true, label: 'Rol', sortable: true},
  })

  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _users = signal<User[]>([]);

  private readonly _filteredUsers = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._users().filter((u) => u.email.toLowerCase().includes(emailFilter));
    }
    return this._users();
  });

  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);

  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredUsers();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email))
      .slice(start, end);
  });
  protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
    this._filteredSortedPaginatedPayments().every((payment) => this._selected().includes(payment)),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<User> = (_: number, p: User) => p.id;
  protected readonly _totalElements = computed(() => this._filteredUsers().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });


  protected toggleUser(payment: User) {
    this._selectionModel.toggle(payment);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedPayments());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
    }
  }

  protected handleEmailSortChange() {
    const sort = this._emailSort();
    if (sort === 'ASC') {
      this._emailSort.set('DESC');
    } else if (sort === 'DESC') {
      this._emailSort.set(null);
    } else {
      this._emailSort.set('ASC');
    }
  }

  onDeletedUser(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        toast.success('Usuario eliminado correctamente');

        this._users.set(this._users().filter((u) => u.id !== user.id));
      },
      error: (error) => {
        console.error('Error al eliminar el usuario', error);
        toast.error('Error al eliminar el usuario');
  }
  });
  }

  isEditing = signal(false);

  onClickEdit(user: User) {
    this.isEditing.set(true);
    this.formModel.controls.name.value.set(user.name);
    this.formModel.controls.lastName.value.set(user.lastName);
    this.formModel.controls.email.value.set(user.email);
    this.currentRole.set(this.roles.find((r) => r.value === user.role));
    this.formModel.controls.id.value.set(user.id);

    this.states.set('open');
  }

  onCancel() {
    this.isEditing.set(false);
    this.states.set('closed');
    this.formModel.reset();
  }

  onEditUser() {

  
   const  user2: UserEditDTO ={
    actualPassword: this.formModel.controls.password.value() || '',
    creditCards: [],
    direcciones: [],
    email: this.formModel.controls.email.value(),
    id: this.formModel.controls.id.value(),
    Image: undefined,
    lastName: this.formModel.controls.lastName.value(),
    name: this.formModel.controls.name.value(),
    newPassword: this.formModel.controls.password.value() || '',
   }
    this.userService.updateUser(user2).subscribe({
      next: () => {
        console.log('Usuario actualizado correctamente');
        toast.success('Usuario actualizado correctamente');
        this.isEditing.set(false);
        this.states.set('closed');
        this.userService.getAllUsers().subscribe({
          next: (users) => {
            this._users.set(users);
          },
          error: (error) => {
            console.error('Error al cargar los usuarios', error);
          }
        });
        
      },
      error: (error) => {
        console.error('Error al actualizar el usuario', error);
        toast.error('Error al actualizar el usuario');
      }
    });
  }


}
