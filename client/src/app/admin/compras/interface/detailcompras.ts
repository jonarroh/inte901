export interface DetailPurchase {
  id?: number;
  quantity?: number;
  priceSingle?: number;
  presentation?: string;
  expiration?: string;
  unitType?: string;
  createdAt?: string;
  status?: string;
  idPurchase?: number;
  idProduct?: number;
  purchase?: any; // Esto puede ser ajustado según el tipo de datos real
  product?: any;  // Esto puede ser ajustado según el tipo de datos real
}
