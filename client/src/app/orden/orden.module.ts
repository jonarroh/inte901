import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenComponent } from './orden/orden.component';
import { OrdenTableComponent } from './orden-table/orden-table.component';



@NgModule({
  declarations: [
    OrdenComponent,
    OrdenTableComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OrdenModule { }
