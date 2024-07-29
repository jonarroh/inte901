import { Component, inject } from '@angular/core';
import { NavComponent } from '../componentes/nav/nav.component';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogHeaderComponent, HlmDialogFooterComponent, HlmDialogTitleDirective, HlmDialogDescriptionDirective } from '~/components/ui-dialog-helm/src';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { BrnDialogTriggerDirective, BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { forkJoin, from, map, Observable, switchMap, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProveedoresService } from './service/proveedores.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MateriaPrima } from '../materias-primas/interface/materias-primas';
import { MateriaPrimaProveedor } from './interface/materiaPrimaProveedor';
import { Proveedor } from './interface/proveedor';
import { MateriasPrimasService } from '../materias-primas/service/materias-primas.service';

interface ProveedorConMaterias extends Proveedor {
  materiasPrimas: string;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    NavComponent,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmInputDirective,
    CommonModule,
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent {
  proveedorService = inject(ProveedoresService);
  materiasPrimasService = inject(MateriasPrimasService);
  proveedores$: Observable<ProveedorConMaterias[]> = new Observable<ProveedorConMaterias[]>();
  materiasPrimas$: Observable<MateriaPrima[]>;
  materiaPrimaProveedor: MateriaPrimaProveedor = {};
  proveedor: Proveedor = {};
  editMode: boolean = false;
  selectedMateriasPrimas: number[] = [];

  constructor() {
    this.refreshProveedores();
    this.materiasPrimas$ = this.materiasPrimasService.getMateriaPrima().pipe(
      map(materiasPrimas => materiasPrimas.filter(mp => mp.estatus === 1))
    );
  }

  trackByProveedorId(index: number, proveedor: any): number {
    return proveedor.id!;
  }

  onSubmitAdd(form: NgForm) {
    if (form.valid) {
      this.proveedor.estatus = 1;
      this.proveedor.createdAt = new Date().toISOString();
      this.proveedorService.registrarProveedor(this.proveedor).pipe(
        switchMap(response => {
          const materiaPrimaProveedores = this.selectedMateriasPrimas.map(materiaPrimaId => ({
            proveedorId: response.id,
            materiaPrimaId
          }));
          return forkJoin(materiaPrimaProveedores.map(materiaPrimaProveedor =>
            this.proveedorService.registrarMateriaPrimaProveedor(materiaPrimaProveedor)
          ));
        }),
        tap(() => {
          console.log('Proveedor y materias primas asociados');
          form.resetForm();
          this.proveedor = {};
          this.materiaPrimaProveedor = {};
          this.selectedMateriasPrimas = [];
          this.refreshProveedores();
        })
      ).subscribe();
    }
  }

  onSubmitEdit(form: NgForm) {
    if (form.valid) {
      this.proveedorService.editarProveedor(this.proveedor.id!, this.proveedor).pipe(
        switchMap(() => {
          return this.proveedorService.getMateriasPrimasProveedores().pipe(
            map(materiasPrimasProveedores =>
              materiasPrimasProveedores.filter(mpp => mpp.proveedorId === this.proveedor.id)
            ),
            switchMap(existingMateriasPrimasProveedores => {
              const toAdd = this.selectedMateriasPrimas.filter(
                mpId => !existingMateriasPrimasProveedores.some(emp => emp.materiaPrimaId === mpId)
              ).map(mpId => this.proveedorService.registrarMateriaPrimaProveedor({
                proveedorId: this.proveedor.id!,
                materiaPrimaId: mpId
              }));
              return forkJoin(toAdd);
            })
          );
        }),
        tap(() => {
          console.log('Proveedor y materias primas asociados');
          form.resetForm();
          this.proveedor = {};
          this.materiaPrimaProveedor = {};
          this.selectedMateriasPrimas = [];
          this.editMode = false;
          this.refreshProveedores();
        })
      ).subscribe();
    }
  }

  onAdd() {
    this.proveedor = {};
    this.selectedMateriasPrimas = [];
    const addButton = document.getElementById('add-proveedor-trigger');
    addButton?.click();
  }

  onEdit(proveedor: Proveedor) {
    this.proveedor = { ...proveedor };
    this.editMode = true;
    this.proveedorService.getMateriasPrimasProveedores().pipe(
      map(materiasPrimasProveedores =>
        materiasPrimasProveedores.filter(mpp => mpp.proveedorId === proveedor.id).map(mpp => mpp.materiaPrimaId!)
      ),
      tap(materiaPrimaIds => this.selectedMateriasPrimas = materiaPrimaIds)
    ).subscribe();
    const editButton = document.getElementById('edit-proveedor-trigger');
    editButton?.click();
  }

  onDelete(id: number) {
    this.proveedorService.eliminarProveedor(id).subscribe(() => {
      console.log('Proveedor eliminado');
      this.refreshProveedores();
    });
  }

  refreshProveedores() {
    this.proveedores$ = this.proveedorService.getProveedores().pipe(
      map(proveedores => proveedores.filter(proveedor => proveedor.estatus === 1)),
      switchMap(proveedores =>
        forkJoin(proveedores.map(proveedor =>
          this.proveedorService.getMateriasPrimasProveedores().pipe(
            map(materiasPrimasProveedores => materiasPrimasProveedores.filter(mpp => mpp.proveedorId === proveedor.id)),
            map(materiasPrimasProveedores => ({
              ...proveedor,
              materiasPrimas: materiasPrimasProveedores.map(mpp => mpp.materiaPrimaId).join(', ')
            }))
          )
        ))
      )
    );
  }
}