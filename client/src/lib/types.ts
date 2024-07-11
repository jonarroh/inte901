export interface Proveedor {
  id: number;
  nombreEmpresa: string;
  direccionEmpresa: string;
  telefonoEmpresa: string;
  nombreEncargado: string;
  estatus: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  idUsuario: number;
  materiaPrimaProveedores: string[];
}

export interface MateriaPrimaProveedor {
  id: number;
  materiaPrimaId: number;
  materiaPrima: string;
  proveedorId: number;
  proveedor: Proveedor;
}

export interface InventarioMp {
  id: number;
  idMateriaPrima: number;
  materiaPrima: string;
  unidadMedida: string;
  cantidad: string;
  idCompra: number;
  caducidad: string;
  estatus: number;
  createdAt: string;
}

export interface MateriaPrima {
  id: number;
  material: string;
  estatus: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  materiaPrimaProveedores: MateriaPrimaProveedor[];
  inventarioMps: InventarioMp[];
  ingredientes: string[];
}

export interface Ingrediente {
  id: number;
  idProducto: number;
  producto: string;
  idMateriaPrima: number;
  materiaPrima: MateriaPrima;
  cantidad: number;
  unidadMedida: string;
  estatus: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface InventarioPostre {
  idPostre: number;
  idProducto: number;
  producto: string;
  cantidad: string;
  estatus: number;
  createdAt: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  estatus: number;
  tipo: TipoProducto;
  cantidadXReceta: number;
  createdAt: string;
  ingredientes: Ingrediente[];
  inventarioPostres: InventarioPostre[];
}

export type TipoProducto = 'Postres' | 'Bebidas'  | 'Comidas';

export interface Espacio {
  idEspacio: number;
  nombre: string;
  canPersonas: number;
  precio: number;
  estatus: string;
  descripcion: string;
}
