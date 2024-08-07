import { Ingrediente, InventarioPostre, TipoProducto } from "~/lib/types";

export interface Producto {
  id?: number;
  nombre?: string;
  precio?: number;
  descripcion?: string;
  idProducto?: number;
  estatus?: number;
  tipo?: TipoProducto;
  cantidadXReceta?: number;
  createdAt?: string;
  ingredientes?: Ingrediente[];
  inventarioPostres?: InventarioPostre[];
}
