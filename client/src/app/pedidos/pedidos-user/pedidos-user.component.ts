import { Component, OnInit } from '@angular/core';
import { Order, Producto } from '~/lib/types';
import { PedidosUserServiceService } from './pedidos-user-service.service';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ProductoService } from '../../admin/productos/service/producto.service';
import { Router } from '@angular/router';
import { PedidoStateService } from '../pedido-state/pedido-state.service';

@Component({
  selector: 'app-pedidos-user',
  standalone: true,
  imports: [NavbarComponent, NgFor, CurrencyPipe, NgIf],
  templateUrl: './pedidos-user.component.html',
  styleUrls: ['./pedidos-user.component.css']
})
export class PedidosUserComponent implements OnInit {
  orders: Order[] = [];
  productos: { [key: number]: { nombre: string; id: number } } = {};
  error: string | null = null;

  constructor(
    private pedidosUserService: PedidosUserServiceService,
    private productoService: ProductoService,
    private router: Router,
    private pedidoStateService: PedidoStateService
  ) {}
  
  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.pedidosUserService.getOrdersByUser(userId).subscribe({
        next: (data) => {
          this.orders = data;
          this.orders.forEach(order => {
            order.detailOrders.forEach(detail => {
              this.productoService.getProductoById(detail.idProduct).subscribe({
                next: (producto) => {
                  this.productos[detail.idProduct] = { 
                    nombre: producto.nombre || 'Desconocido', 
                    id: producto.id ?? 0 
                  };
                },
                error: (err) => {
                  console.error('Error fetching product', err);
                }
              });
            });
          });
        },
        error: (err) => {
          console.error('Error fetching orders', err);
          this.error = 'No se pudieron cargar las órdenes. Por favor, inténtelo de nuevo más tarde.';
        }
      });
    } else {
      this.error = 'No se encontró el ID de usuario.';
    }
  }

  private getUserIdFromLocalStorage(): number | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  viewStatus(orderId: number): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      const productIds = order.detailOrders.map(detail => detail.idProduct);
      this.pedidoStateService.setOrderId(orderId);
      this.pedidoStateService.setProductIds(productIds);
      this.pedidoStateService.setOrderStatus(order.status); // Asegúrate de que este método esté implementado en el servicio

      this.router.navigate(['/estatus', orderId], {
        queryParams: { 
          productIds: productIds.join(','), 
          status: order.status 
        }
      });
    }
  }
}