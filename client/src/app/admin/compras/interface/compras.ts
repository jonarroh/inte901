import { DetailPurchase } from './detailcompras';
import { Proveedor } from './proveedor';
import { Usuario } from './usuario';

export interface Compra {
  id?: number;
  idProveedor?: number;
  idUser?: number;
  createdAt?: string;
  status?: string;
  detailPurchases?: DetailPurchase[]; // Corrección aquí: debe ser un array de objetos, no strings
  proveedor?: Proveedor;
  user?: Usuario;
}
