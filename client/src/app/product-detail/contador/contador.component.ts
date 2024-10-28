import { Component, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CartService, ProductoWithQuantity } from '~/app/cart/cart.service';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { Order, Producto } from '~/lib/types';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { CheckoutService } from '~/app/checkout/checkout.service';
import { CommonModule } from '@angular/common';
import { MoneyComponent } from '~/components/money/money.component';

@Component({
  selector: 'product-contador',
  standalone: true,
  imports: [
HlmButtonDirective,
LucideAngularModule,
HlmToasterComponent,
CommonModule,
MoneyComponent
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
  isLoaded = signal(false);

  increment() {
    this.isLoaded.set(true);
    this.checkoutService.cheackInventory({
      idProduct: this.product().id,
      quantity: this.contador() - 1
    }).subscribe({
      error: (err) => {
        console.log(err.error.text);
        if(err.error.text === 'Inventario disponible.'){
         this.contador.update(value => value + 1);
        }else{
         toast.error('No hay suficiente inventario');
        }
        this.isLoaded.set(false);
       }
    })
  }

  returnToProducts() {
    this.router.navigate(['/products']);
  }


  decrement() {

    if (this.contador() <= 1) {
      return;
    }
  }

  
  setOrder(): void{
    //agregar el producto al carrito
    this.agregarAlCarrito();
    //crear la orden
    this.router.navigate(['/checkout/address']);
  }
  get total() {
    return (this.product().precio * this.contador()) + this.cartService.cartSignal().reduce((acc, item) => acc + item.precio * item.quantity, 0);
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
  this.router.navigate(['/products']);
  toast('Producto agregado al carrito',{
    
  });
}
}
