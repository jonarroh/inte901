import { DetailPurchase } from './detailcompras';
import { Proveedor } from './proveedor';
import { Usuario } from './usuario';

export interface Compra {
  id?: number;
  idUser?: number;
  createdAt?: Date;
  status?: string; // Pendiente, Aceptada, Cancelada, Entregada
  total?: number;
  details?: DetailPurchase[];
}
