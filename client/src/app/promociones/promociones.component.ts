import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { HlmLabelDirective } from '~/components/ui-label-helm/src';
import { HlmSheetComponent, HlmSheetContentComponent, HlmSheetDescriptionDirective, HlmSheetFooterComponent, HlmSheetHeaderComponent, HlmSheetTitleDirective } from '~/components/ui-sheet-helm/src';
import { PromocionesService } from './promociones.service';
import { Observable,forkJoin, of  } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BadgeUser, PromocionesDTO } from '../../lib/types';
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
export class PromocionesComponent implements OnInit {
  promocionServe = inject(PromocionesService);
  productosServe = inject(ProductosService);

  userId = localStorage.getItem('userId');
  promociones: PromocionesDTO[] = [];
  isSheetOpen = false;

  constructor() { }

  ngOnInit() {
    this.loadPromotions();
  }

  toggleSheet() {
    this.isSheetOpen = !this.isSheetOpen;
  }

  private loadPromotions() {
    if (!this.userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.promocionServe.getBadgeId(Number(this.userId))
      .pipe(
        // Obtener el primer badge y su id
        map(badges => badges.length > 0 ? badges[0].badges.id : 0),
        tap(idBadge => {
          if (idBadge === 0) {
            console.warn('No se encontraron badges para el usuario');
          }
        }),
        // Obtener promociones con el id del badge
        switchMap(idBadge =>
          this.promocionServe.getPromociones(idBadge).pipe(
            catchError(error => {
              console.error('Error al cargar promociones', error);
              return of([]); // Retornar un arreglo vacío en caso de error
            })
          )
        ),
        // Reemplazar IDs de productos con sus nombres
        switchMap(promociones =>
          forkJoin(
            promociones.map(promo =>
              this.productosServe.getProducto(Number(promo.productos)).pipe(
                map(producto => ({
                  ...promo,
                  productos: producto.nombre,
                }))
              )
            )
          )
        )
      )
      .subscribe({
        next: promociones => {
          this.promociones = promociones;
        },
        error: error => {
          console.error('Error en el flujo de datos', error);
        },
      });
  }
}
