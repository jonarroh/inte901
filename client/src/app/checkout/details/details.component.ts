import { Component, signal } from '@angular/core';
import { CheckoutService } from '../checkout.service';
import { Address, CreditCard, CreditCardWithCvv, DetailOrder, Ingrediente, Order } from '~/lib/types';
import { CartService } from '~/app/cart/cart.service';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '~/components/breadcrumb/breadcrumb.component';
import { MoneyComponent } from '~/components/money/money.component';
import { UserService } from '~/app/home/services/user.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent,
    MoneyComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

    constructor(private checkoutService: CheckoutService,private cartService: CartService, private router : Router, private userSerice: UserService) {
      console.log(this.order());
      console.log("llego al constructor");
    }
    order = signal<Order>({} as Order);
    isOrderToStore = signal<boolean>(JSON.parse(localStorage.getItem('isOrderToStore') || 'false'));
    isPaidWithCard = signal<boolean>(JSON.parse(localStorage.getItem('isPaidWithCard') || 'false'));
    selectedCard = signal<CreditCardWithCvv>(JSON.parse(localStorage.getItem('selectedCard') || `{}`));
    selectedAddress = signal<Address>(JSON.parse(localStorage.getItem('selectedAddress') || '{}'));
    products = this.cartService.cartSignal;
    total = this.cartService.total;
  

    getSubtotal() {
      return this.products().reduce((acc, product) => acc + (product.precio - (product.discount ?? 0)), 0);
    }

    addPuntos(cantidad: number = 0){
      this.userSerice.addPoints(cantidad * 20 ).subscribe({
        next: (res) => {
          console.log(res);
          toast.success('Puntos añadidos con éxito');
        },
        error: (err) => {
          console.log(err);
          toast.error('Error al añadir los puntos '+ JSON.stringify(err.error));
        }
      });
    }
  
    getTotal() {
      return this.getSubtotal();
    }
    getImageUrl(productId: number): string {
      return `http://localhost:5000/static/productos/${productId}.webp`;
    }

    getIdClient() {
      return Number(localStorage.getItem('userId'));
    }


    onOrder() {
      this.checkoutService.setOrder({
        id: 0,
        creditCard: this.selectedCard(),
        direcciones: this.selectedAddress(),
        isDeliver: !this.isOrderToStore(),
        idClient: this.getIdClient(),
        status : 'Ordenado',
        ticket: '',
        detailOrders: [
          ...this.products().map((product) => ({
            id: 0,
            idProduct: product.id,
            quantity: product.quantity,
            idOrder: 0,
            ingredients: '',
            priceSingle: product.precio,
            dateOrder: new Date().toISOString(),
            status: 'Ordenado',
            discount: product.discount,
            

          })),
        ],
        total: this.getTotal(),
        idUser: 1,
        orderDate: new Date().toISOString(),
      });
      
      //hacer la orden
      this.checkoutService.postOrder(this.checkoutService.orderSignal()).subscribe({
        complete: () => {
          
          this.router.navigate(['orders']);
        },
        error: (err) => {
          console.log(err);
          toast.error('Error al hacer la orden '+ JSON.stringify(err.error));
        },
        next: (res) => {
          console.log(res);
          toast.success('Orden realizada con éxito');
          this.addPuntos(this.cartService.cartSignal().length);
          this.cartService.clearCart();
          this.checkoutService.isOrderToStore.set(false);
          this.checkoutService.isPaidWithCard.set(false);
          this.checkoutService.selectedCard.set({} as CreditCard);
          this.checkoutService.selectedAddress.set({} as Address);
          // this.router.navigate(['products']);
        }
      });

    }

    //limpiar carrito
    onClearCart() {
      this.cartService.clearCart();
    }
    
}
