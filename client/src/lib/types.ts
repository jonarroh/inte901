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

export type Roles = 'Admin' | 'Cliente' | 'Proveedor';

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
  numeroExterior: number;
  estatus:string;
}

export interface CreditCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
  userId: number;
  estatus: string;
  cvv: string;
}

export interface FullCreditCard {

}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token: string;
  estatus: string;
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
  idOrder: number;
  quantity: number;
  priceSingle: number;
  dateOrder: string;
  ingredients: string;
  status: string;
}


export interface Order {
  id: number;
  idClient: number;
  idUser: number;
  total: number;
  isDeliver: boolean;
  orderDate: string;
  status: string;
  detailOrders: DetailOrder[];
  creditCard: CreditCard;
  direcciones: Address;
  ticket: string;
}

export interface UserEditDTO{
  id: number;
  name: string;
  lastName: string;
  email: string;
  newPassword: string | undefined;
  Image: File | undefined;
  actualPassword: string | undefined;
  direcciones: Address[] | undefined;
  creditCards: CreditCard[] | undefined;
}
export interface CreditCardWithCvv{
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  userId: number;
  id: number;
  estatus: string;
}
export interface DetailReserva {
  fecha: string; // o Date si se maneja como objeto Date
  horaInicio: string;
  horaFin: string;
  idEspacio: number;  // Relación con Espacio
}

export interface Reserva {
  name: string;
  startTime: string;
  endTime: string;
}


export interface DetailReservaDTO {
  idDetailReser: number;
  fecha: string; // Puedes ajustar el tipo según tus necesidades
  horaInicio: string;
  horaFin: string;
  idEspacio: number;
}

export interface ReservaDTO {
  idUsuario: number;
  idCliente: number;
  estatus: string;
  detailReserva: DetailReservaDTO;
}


export class OrderListComponent {
  orders: any[] = [];
  productos: any = {};
  searchTerm: string = '';
  selectedFilter: string = '';
  error: string = '';
}