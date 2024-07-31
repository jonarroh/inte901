import { User } from './usuario';
import { DetailOrder } from './detailorder';

export interface Order {
  id?: number;
  orderDate?: string;
  idClient?: number;
  total?: number;
  status?: string;
  ticket?: number;
  details?: DetailOrder[];
  user?: User;
}
