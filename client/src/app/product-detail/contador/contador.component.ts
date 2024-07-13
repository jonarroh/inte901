import { Component, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CartService, ProductoWithQuantity } from '~/app/cart/cart.service';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { Order, Producto } from '~/lib/types';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { CheckoutService } from '~/app/checkout/checkout.service';

@Component({
  selector: 'product-contador',
  standalone: true,
  imports: [
HlmButtonDirective,
LucideAngularModule,
HlmToasterComponent,

  ],
  templateUrl: './contador.component.html',
  styleUrl: './contador.component.css'
})
export class ContadorComponent {
  constructor(private router:Router,private cartService: CartService,
    private checkoutService: CheckoutService) {
    
  }

  contador = signal(1);
  product = input.required<Producto>();

  increment() {
    this.contador.update(value => value + 1);
  }

  returnToProducts() {
    this.router.navigate(['/products']);
  }

  decrement() {
    if (this.contador() <= 1) {
      return;
    }
    this.contador.update(value => value - 1);
  }

  
  setOrder(): void{
    console.log('setOrder');
    const order: Order ={
      id:0,
      idClient: Number(localStorage.getItem('userId')),
      idUser: Number(localStorage.getItem('userId')),
      orderDate: new Date().toString(),
      total: this.total,
      detailOrders:[
        {
          id:0,
          idProduct:this.product().id,
          quantity: this.contador(),
          dateOrder: new Date().toString(),
          ingredients: `
          ${this.product().ingredientes.map(ingrediente => ingrediente.producto).join(', ')}
          `,
          status: 1,
          nameProduct: this.product().nombre,
          priceSingle: this.product().precio,
          ticket: 0
        }
      ]
    }
    this.checkoutService.setOrder(order);
    toast('Producto en proceso de compra',{
      action: {
        label: 'X',
        onClick: () => toast.dismiss(),
      }
    })
  }
  get total() {
    return this.product().precio * this.contador();
  }

  
  agregarAlCarrito() {
    if(this.contador() <= 0) {
      toast('No se puede agregar 0 productos al carrito',{
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        }
      });
      return;
    }
    const newProductWithQuantity = {
      ...this.product(),
      quantity: this.contador()
    } as ProductoWithQuantity;
  
  if(this.product() == null) {
    toast('No se puede agregar un producto nulo al carrito',{
      action: {
        label: 'X',
        onClick: () => toast.dismiss(),
      }
    });
    return;
  }
  this.cartService.addItem(newProductWithQuantity);
  this.contador.update(() => 0);
  toast('Producto agregado al carrito',{
    
  });
}
}
