import { Component, inject } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { HlmLabelDirective } from '~/components/ui-label-helm/src';
import { HlmSheetComponent, HlmSheetContentComponent, HlmSheetDescriptionDirective, HlmSheetFooterComponent, HlmSheetHeaderComponent, HlmSheetTitleDirective } from '~/components/ui-sheet-helm/src';
import { PromocionesService } from './promociones.service';
import { Observable } from 'rxjs';
import { PromocionesDTO } from '../../lib/types';
import { ProductosService } from '../home/services/productos.service';
import { da } from 'date-fns/locale';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmIconComponent,
    HlmLabelDirective,
    CommonModule,
    NgForOf
  ],
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.css'
})
export class PromocionesComponent {
  promocionServe = inject(PromocionesService);
  productosServe = inject(ProductosService);
  promo$: Observable<PromocionesDTO[]>;
  promociones: PromocionesDTO[] = [];
  idUser = localStorage.getItem('idUser');

  constructor(){
    this.promo$ = this.promocionServe.getPromociones();

    this.promo$.subscribe(data => {
      data.forEach(promo => {
        this.productosServe.getProducto(Number(promo.productos)).subscribe(producto => {
          promo.productos = producto.nombre;
          console.log(promo.productos);
        });

        this.promociones.push(promo);
      });
    });

    this.cargarPromociones();
  }

  isSheetOpen = false;

  toggleSheet() {
    this.isSheetOpen = !this.isSheetOpen;
  }

  cargarPromociones() {
    this.promo$ = this.promocionServe.getPromociones();
  }
}
