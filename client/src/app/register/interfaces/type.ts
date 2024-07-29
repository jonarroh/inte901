interface Direccion {
    id: number;
    calle: string;
    colonia: string;
    ciudad: string;
    estado: string;
    pais: string;
    codigoPostal: string;
    userId: number;
  }
  
  interface CreditCard {
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
    direcciones: Direccion[];
    creditCards: CreditCard[];
    estatus: string;
  }
  