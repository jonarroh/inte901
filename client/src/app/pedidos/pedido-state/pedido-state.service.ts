import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidoStateService {
  private readonly ORDER_ID_KEY = 'orderId';
  private readonly PRODUCT_IDS_KEY = 'productIds';
  private readonly ORDER_STATUS_KEY = 'orderStatus';

  // Señales para los estados
  private orderIdSignal = signal<number | null>(
    parseInt(localStorage.getItem(this.ORDER_ID_KEY) || '0', 10)
  );
  private orderStatusSignal = signal<string | null>(
    localStorage.getItem(this.ORDER_STATUS_KEY)
  );
  private productIdsSignal = signal<number[]>(
    JSON.parse(localStorage.getItem(this.PRODUCT_IDS_KEY) || '[]')
  );

  // Computed properties (opcional)
  productIds = computed(() => {
    console.log('Received product IDs in PedidoStateService:', this.productIdsSignal());
    return this.productIdsSignal();
  });
  orderStatus = computed(() => this.orderStatusSignal());
  orderId = computed(() => this.orderIdSignal());

  // Métodos para actualizar el estado y localStorage
  setOrderId(orderId: number): void {
    localStorage.setItem(this.ORDER_ID_KEY, orderId.toString());
    this.orderIdSignal.set(orderId);
  }

  getOrderId(): number | null {
    return this.orderIdSignal();
  }

  setOrderStatus(status: string): void {
    localStorage.setItem(this.ORDER_STATUS_KEY, status);
    this.orderStatusSignal.set(status);
  }

  getOrderStatus(): string | null {
    return this.orderStatusSignal();
  }

  setProductIds(ids: number[]): void {
    localStorage.setItem(this.PRODUCT_IDS_KEY, JSON.stringify(ids));
    this.productIdsSignal.set(ids);
  }

  getProductIds(): number[] {
    return this.productIdsSignal();
  }
}
