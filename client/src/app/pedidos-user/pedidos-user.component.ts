import { Component, OnInit } from '@angular/core';
import { Order, Producto } from '~/lib/types';
import { PedidosUserServiceService } from './pedidos-user-service.service';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ProductoService } from '../admin/productos/service/producto.service';
import { Router } from '@angular/router';
import { PedidoStateService } from '../pedido-state/pedido-state.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos-user',
  standalone: true,
  imports: [NavbarComponent, NgFor, CurrencyPipe, NgIf, FormsModule, CommonModule],
  templateUrl: './pedidos-user.component.html',
  styleUrls: ['./pedidos-user.component.css']
})
export class PedidosUserComponent implements OnInit {
  orders: Order[] = [];
  productos: { [key: number]: { nombre: string; id: number } } = {};
  error: string | null = null;
  searchTerm: string = '';
  selectedFilter: string = '';
  
  statusColorMap = {
    'Ordenado': ['#f17d6f', 'gray', 'gray', 'gray', 'gray'],
    'Aceptado': ['#f17d6f', '#f3a560', 'gray', 'gray', 'gray'],
    'Preparacion': ['#f17d6f', '#f3a560', '#f3bb60', 'gray', 'gray'],
    'Enviado': ['#f17d6f', '#f3a560', '#f3bb60', '#f3e860', 'gray'],
    'Recibido': ['#f17d6f', '#f3a560', '#f3bb60', '#f3e860', '#7ec88b']
  };

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
  filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesStatus = this.selectedFilter === '' || order.status === this.selectedFilter;
      const matchesSearchTerm = 
        order.id.toString().includes(this.searchTerm) ||
        order.total.toString().includes(this.searchTerm) ||
        order.detailOrders.some(detail =>
          this.productos[detail.idProduct]?.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          detail.quantity.toString().includes(this.searchTerm)
        );
  
      return matchesStatus && matchesSearchTerm;
    });
  }
  

  viewStatus(orderId: number): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      const productIds = order.detailOrders.map(detail => detail.idProduct);
      this.pedidoStateService.setOrderId(orderId);  // Asegúrate de que este método exista en el servicio
      this.pedidoStateService.setProductIds(productIds);
      this.pedidoStateService.setOrderStatus(order.status);

      // Guardar los datos en localStorage
      localStorage.setItem('productIds', JSON.stringify(productIds));
      localStorage.setItem('orderStatus', order.status);

      this.router.navigate(['/estatus', orderId]);
    }
  }

  

  // Método para obtener el color del botón según el estado y el índice
  getStatusColor(status: string, step: number): string {
    const statusColors = this.statusColorMap[status as keyof typeof this.statusColorMap];
    return statusColors ? statusColors[step - 1] : '#d3d3d3';
  }
}