import { MateriaPrimaProveedor } from "~/lib/types";

export interface DetailPurchase {
  id?: number;
  quantity?: number;
  priceSingle?: number;
  presentation?: string;
  unitType?: string;
  status?: string; // Pendiente, Cancelado, Entregado
  idPurchase?: number;
  purchase?: {
    idProveedor: number;
  };
  materiaPrimaProveedor?: {
    materiaPrimaId?: number;
    proveedorId?: number;
  };
}
