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

export interface Address {
  id: number;
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigoPostal: string;
  userId: number;
}

export interface CreditCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token: string;
  direcciones: Address[];
  creditCards: CreditCard[];
}


export interface Espacio {
  idEspacio: number;
  nombre: string;
  canPersonas: number;
  precio: number;
  estatus: string;
  descripcion: string;
}

export interface DetailOrder {
  id: number;
  idProduct: number;
  nameProduct: string;
  quantity: number;
  priceSingle: number;
  status: number;
  dateOrder: string;
  ticket: number;
  ingredients: string;
}

export interface Order {
  id: number;
  idClient: number;
  idUser: number;
  total: number;
  orderDate: string;
  detailOrders: DetailOrder[];
}
