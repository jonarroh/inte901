import { Component, computed, signal } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { BadgeUser, PromocionesPersonalizadasDTO } from '~/lib/types';
import { SerRewadsService } from './ser-rewads.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart.service';
import { HttpClient } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-rewads',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './rewads.component.html',
  styleUrl: './rewads.component.css'
})
export class RewadsComponent {

  private apiUrl = 'https://localhost:7268/api/Productos';

  userId = localStorage.getItem('userId');
  
  public userBadges = signal <BadgeUser[]>([]);
  public promosBadges = signal <PromocionesPersonalizadasDTO[]>([]); 
  highestBadgeName = computed(() => {
    const badges = this.userBadges();
    if (!badges.length) return '';
    
    const highestBadge = badges.reduce((prev, current) => {
      return (prev.badges.pointsRequired > current.badges.pointsRequired) 
        ? prev 
        : current;
    });
    
    return highestBadge.badges.name;
  });
  
  constructor(private http: HttpClient, private badgeService : SerRewadsService, private cartService: CartService){}
  
  ngOnInit(): void {
    this.fetchBadges();
    //this.fetchPromos();
  }

  fetchBadges(): void{

    this.badgeService.getBadgesByUserId(this.userId ?? '').subscribe({
      next: (response: any) => {
        this.userBadges.set(response)
        console.log(response);
        this.fetchPromos();
      }
    })
  }

  fetchPromos(): void{

    console.log(this.userBadges()[0].badges.id);

    this.badgeService.getPromoByBadgeId(String(this.userBadges()[0].badges.id)).subscribe({
      next: (response: any) => {
        this.promosBadges.set(response)
        console.log(response);
      }
    })
  }

  isBadgeLocked(achievedAt: number | null): boolean {
    return achievedAt === null;
  }

  irProCarrito(promo : PromocionesPersonalizadasDTO)
  {

    this.http.get(`${this.apiUrl}/${promo.productoId}`).subscribe(

      (producto: any) => {
    
console.log({promo});

    this.cartService.addItem({
      cantidadXReceta: producto.cantidadXReceta,
      descripcion: producto.descripcion,
      id: producto.id,
      nombre: producto.nombre,
      createdAt: producto.createdAt,
      estatus: producto.estatus,
      ingredientes: producto.ingredientes,
      precio: producto.precio,
      inventarioPostres: producto.inventarioPostres,
      quantity: 1,
      tipo: producto.tipo,
      discount: promo.descuento,
    });
    //TODO: cerrar modal

    toast.success('Producto agregado al carrito');
  },
  (error) => {
    // Manejar errores
    console.error('Error al obtener el producto:', error);
    toast.error('No se pudo agregar el producto al carrito');
  
  }
);
  }

}
