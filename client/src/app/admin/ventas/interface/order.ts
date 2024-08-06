import { User } from './usuario';
import { DetailOrder } from './detailorder';

export interface Order {
  id?: number;
  orderDate?: string;
  idClient?: number;
  idUser?: number;
  total?: number;
  status?: string;
  ticket?: number;
  isDelivery?: boolean;
  details?: DetailOrder[];
  user?: User;
}
