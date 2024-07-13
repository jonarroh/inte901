import { Component, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CartService, ProductoWithQuantity } from '~/app/cart/cart.service';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { Producto } from '~/lib/types';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

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
  constructor(private router:Router,private cartService: CartService) {
    
  }

  contador = signal(0);
  product = input.required<Producto>();

  increment() {
    this.contador.update(value => value + 1);
  }

  returnToProducts() {
    this.router.navigate(['/products']);
  }

  decrement() {
    if (this.contador() <= 0) {
      return;
    }
    this.contador.update(value => value - 1);
  }

  
  agregarAlCarrito() {
    if(this.contador() <= 0) {
      toast('No se puede agregar 0 productos al carrito',{
        
      });
      return;
    }


    const newProductWithQuantity = {
      ...this.product(),
      quantity: this.contador()
    } as ProductoWithQuantity;
  
  if(this.product() == null) {
    toast('No se puede agregar un producto nulo al carrito',{
      
    });
    return;
  }
  this.cartService.addItem(newProductWithQuantity);
  toast('Producto agregado al carrito',{
    
  });
}
}
