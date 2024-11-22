import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import { HlmIconComponent } from '~/components/ui-icon-helm/src';
import { HlmLabelDirective } from '~/components/ui-label-helm/src';
import { HlmSheetComponent, HlmSheetContentComponent, HlmSheetDescriptionDirective, HlmSheetFooterComponent, HlmSheetHeaderComponent, HlmSheetTitleDirective } from '~/components/ui-sheet-helm/src';
import { PromocionesService } from './promociones.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BadgeUser, PromocionesCombinadas, PromocionesDTO, PromocionesPersonalizadasDTO } from '../../lib/types';
import { ProductosService } from '../home/services/productos.service';
import { da } from 'date-fns/locale';
import { Router } from '@angular/router';
import { CheckoutService } from '../checkout/checkout.service';
import { CartService } from '../cart/cart.service';
import { MoneyComponent } from '~/components/money/money.component';
import { toast } from 'ngx-sonner';

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
    NgForOf,
    MoneyComponent
  ],
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.css'
})

export class PromocionesComponent implements OnInit {
  promocionServe = inject(PromocionesService);
  productosServe = inject(ProductosService);

  userId = localStorage.getItem('userId');
  promociones: any[] = [];
  promosPersonalizadas: PromocionesPersonalizadasDTO[] = [];
  promosCombinadas: PromocionesCombinadas[] = [];
  isSheetOpen = false;

  constructor(private router: Router, private cartService: CartService,
    private checkoutService: CheckoutService) {
   
     }

   ngOnInit() {
    this.loadPromotions();

  //   this.loadCombinedPromotions();
   }

  toggleSheet() {
    this.isSheetOpen = !this.isSheetOpen;
  }

  private isTodayBirthday(fechaNacimiento: string): boolean {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);

    // Comparar día y mes
    return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
  }


  comprarPromo(promo: PromocionesDTO) {
    this.cartService.addItem({
      cantidadXReceta: promo.productos.cantidadXReceta,
      descripcion: promo.productos.descripcion,
      id: promo.productos.id,
      nombre: promo.productos.nombre,
      createdAt: promo.productos.createdAt,
      estatus: promo.productos.estatus,
      ingredientes: promo.productos.ingredientes,
      precio: promo.productos.precio,
      inventarioPostres: promo.productos.inventarioPostres,
      quantity: 1,
      tipo: promo.productos.tipo,
      discount: promo.descuento,
    })
    //TODO: cerrar modal

    toast.success('Producto agregado al carrito');


  }

  private loadPromotions() {
    
    this.promocionServe.getBadgeId(0)
      .pipe(
        // Obtener el primer badge y su id
        
        // Obtener promociones con el id del badge
        switchMap((idBadge) =>
          this.promocionServe.getPromociones(1).pipe(
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
                  productos: producto,
                }))
              )
            )
          )
        )
      )
      .subscribe({
        next: promociones => {
          console.log('Promociones:', promociones);
          this.promociones = promociones;
        },
        error: error => {
          console.error('Error en el flujo de datos', error);
        },
      });
  }

  // private loadPersonalPromotions() {
  //   if (!this.userId) {
  //     console.error('No se encontró userId en localStorage');
  //     return;
  //   }

  //   this.promocionServe.getBadgeId(Number(this.userId))
  //     .pipe(
  //       map(badges => badges.length > 0 ? badges[0].badges.id : 0),
  //       tap(idBadge => {
  //         if (idBadge === 0) {
  //           console.warn('No se encontraron badges para el usuario');
  //         }
  //       }),
  //       switchMap(idBadge =>
  //         this.promocionServe.getPromosPersonalizadas(idBadge).pipe(
  //           catchError(error => {
  //             console.error('Error al cargar promociones personalizadas', error);
  //             return of([]);
  //           })
  //         )
  //       )
  //     )
  //     .subscribe({
  //       next: promosPersonalizadas => {
  //         this.promosPersonalizadas = promosPersonalizadas;
  //       },
  //       error: error => {
  //         console.error('Error en el flujo de datos', error);
  //       },
  //     });
  // }

  // private loadCombinedPromotions() {
  //   if (!this.userId) {
  //     console.error('No se encontró userId en localStorage');
  //     return;
  //   }

  //   this.promocionServe.getBadgeId(Number(this.userId))
  //     .pipe(
  //       map(badges => badges.length > 0 ? badges[0].badges.id : 0),
  //       tap(idBadge => {
  //         if (idBadge === 0) {
  //           console.warn('No se encontraron badges para el usuario');
  //         }
  //       }),
  //       switchMap(idBadge =>
  //         forkJoin({
  //           promociones: this.promocionServe.getPromociones(idBadge).pipe(
  //             catchError(error => {
  //               console.error('Error al cargar promociones', error);
  //               return of([]);
  //             })
  //           ),
  //           promosPersonalizadas: this.promocionServe.getPromosPersonalizadas(idBadge).pipe(
  //             catchError(error => {
  //               console.error('Error al cargar promociones personalizadas', error);
  //               return of([]);
  //             })
  //           )
  //         })
  //       ),
  //       switchMap(({ promociones, promosPersonalizadas }) =>
  //         forkJoin({
  //           promociones: forkJoin(
  //             promociones.map(promo =>
  //               this.productosServe.getProducto(Number(promo.productos)).pipe(
  //                 map(producto => ({
  //                   ...promo,
  //                   nombreProducto: producto.nombre, // Asigna el nombre del producto
  //                 }))
  //               )
  //             )
  //           ),
  //           promosPersonalizadas: forkJoin(
  //             promosPersonalizadas.map(promoPersonalizada =>
  //               this.productosServe.getProducto(Number(promoPersonalizada.productoId)).pipe(
  //                 map(producto => ({
  //                   ...promoPersonalizada,
  //                   nombreProducto: producto.nombre, // Asigna el nombre del producto
  //                 }))
  //               )
  //             )
  //           )
  //         }) // Add closing parenthesis here
  //       )
  //     )
  //     .subscribe({
  //       next: ({ promociones, promosPersonalizadas }) => {
  //         this.promociones = promociones;
  //         this.promosPersonalizadas = promosPersonalizadas;

  //         // Combinar promociones y promociones personalizadas
  //         this.promosCombinadas = promociones.map(promo => ({
  //           id: promo.id,
  //           nombre: promo.nombre,
  //           descripcion: promo.descripcion,
  //           fechaInicio: promo.fechaInicio,
  //           fechaFin: promo.fechaFin,
  //           descuento: promo.descuento,
  //           estatus: promo.estado,
  //           productos: promo.productos,
  //           badgePromoId: promo.badgePromoId,
  //           limiteCanje: promo.limiteCanje,
  //           tipo: 'General',
  //           motivo: '',
  //           nombreProducto: promo.nombreProducto,
  //         })).concat(promosPersonalizadas.map(promoPersonalizada => ({
  //           id: promoPersonalizada.id,
  //           nombre: promoPersonalizada.nombre,
  //           descripcion: promoPersonalizada.descripcion,
  //           fechaInicio: promoPersonalizada.fechaInicio,
  //           fechaFin: promoPersonalizada.fechaFin,
  //           descuento: promoPersonalizada.descuento,
  //           estatus: promoPersonalizada.estatus,
  //           productos: promoPersonalizada.productoId,
  //           badgePromoId: promoPersonalizada.badgePromoId,
  //           limiteCanje: promoPersonalizada.limiteCanje,
  //           tipo: 'Personalizada',
  //           motivo: promoPersonalizada.motivo,
  //           nombreProducto: promoPersonalizada.nombreProducto,
  //         })));

  //         console.log('Promociones combinadas:', this.promosCombinadas);
  //       },
  //       error: error => {
  //         console.error('Error en el flujo de datos', error);
  //       },
  //     });

  // }
}
