export interface DetailOrder {
  id?: number;
  quantity?: number;
  priceSingle?: number;
  dateOrder?: string;
  ingredients?: string;
  status?: string;
  idOrder?: number;
  idProduct?: number;
  product?: {
    id?: number;
    nombre?: string; // Asegúrate de que esta propiedad coincida con tu back-end
    price?: number;
    // otros campos necesarios
  };
}
