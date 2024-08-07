import { User } from './usuario';
import { DetailOrder } from './detailorder';
import { Address, CreditCard } from '~/lib/types';

export interface Order {
  id?: number;
  orderDate?: string;
  idClient?: number;
  idUser?: number;
  total?: number;
  status?: string;
  ticket?: number;
  isDelivery?: boolean;
  detailOrders?: DetailOrder[];
  user?: User;
  creditCard?: CreditCard | undefined;
  direcciones?: Address | undefined;
}
