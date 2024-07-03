import { Injectable,signal } from '@angular/core';
import { Producto, TipoProducto } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor() { 
    this.productos = this.getProductosPaginados(1);
  }

  private cantidadPagina = signal(10);
  




  private productos: Producto[] = [
    {
      "id": 1,
      "nombre": "Café Americano",
      "precio": 30,
      "descripcion": "Café negro de grano seleccionado",
      "estatus": 1,
      "tipo": "Bebida",
      "cantidadXReceta": 1,
      "createdAt": "2024-07-02T14:17:52.261Z",
      "ingredientes": [
        {
          "id": 1,
          "idProducto": 1,
          "producto": "Café Americano",
          "idMateriaPrima": 1,
          "materiaPrima": {
            "id": 1,
            "material": "Grano de café",
            "estatus": 1,
            "createdAt": "2024-07-02T14:17:52.261Z",
            "updatedAt": "2024-07-02T14:17:52.261Z",
            "deletedAt": "2024-07-02T14:17:52.261Z",
            "materiaPrimaProveedores": [
              {
                "id": 1,
                "materiaPrimaId": 1,
                "materiaPrima": "Grano de café",
                "proveedorId": 1,
                "proveedor": {
                  "id": 1,
                  "nombreEmpresa": "Café del Sur",
                  "direccionEmpresa": "Av. Principal 123, CDMX",
                  "telefonoEmpresa": "555-123-4567",
                  "nombreEncargado": "Juan Pérez",
                  "estatus": 1,
                  "createdAt": "2024-07-02T14:17:52.261Z",
                  "updatedAt": "2024-07-02T14:17:52.261Z",
                  "deletedAt": "2024-07-02T14:17:52.261Z",
                  "idUsuario": 1,
                  "materiaPrimaProveedores": [
                    "Grano de café"
                  ]
                }
              }
            ],
            "inventarioMps": [
              {
                "id": 1,
                "idMateriaPrima": 1,
                "materiaPrima": "Grano de café",
                "unidadMedida": "kg",
                "cantidad": "20",
                "idCompra": 1,
                "caducidad": "2025-01-01T14:17:52.261Z",
                "estatus": 1,
                "createdAt": "2024-07-02T14:17:52.261Z"
              }
            ],
            "ingredientes": [
              "Grano de café"
            ]
          },
          "cantidad": 10,
          "unidadMedida": "gramos",
          "estatus": 1,
          "createdAt": "2024-07-02T14:17:52.261Z",
          "updatedAt": "2024-07-02T14:17:52.261Z",
          "deletedAt": "2024-07-02T14:17:52.261Z"
        }
      ],
      "inventarioPostres": []
    },
    {
      "id": 2,
      "nombre": "Capuccino",
      "precio": 45,
      "descripcion": "Café con leche y espuma",
      "estatus": 1,
      "tipo": "Bebida",
      "cantidadXReceta": 1,
      "createdAt": "2024-07-02T14:17:52.261Z",
      "ingredientes": [
        {
          "id": 2,
          "idProducto": 2,
          "producto": "Capuccino",
          "idMateriaPrima": 2,
          "materiaPrima": {
            "id": 2,
            "material": "Grano de café",
            "estatus": 1,
            "createdAt": "2024-07-02T14:17:52.261Z",
            "updatedAt": "2024-07-02T14:17:52.261Z",
            "deletedAt": "2024-07-02T14:17:52.261Z",
            "materiaPrimaProveedores": [
              {
                "id": 2,
                "materiaPrimaId": 2,
                "materiaPrima": "Grano de café",
                "proveedorId": 2,
                "proveedor": {
                  "id": 2,
                  "nombreEmpresa": "Café del Norte",
                  "direccionEmpresa": "Calle Secundaria 456, Monterrey",
                  "telefonoEmpresa": "818-456-7890",
                  "nombreEncargado": "María López",
                  "estatus": 1,
                  "createdAt": "2024-07-02T14:17:52.261Z",
                  "updatedAt": "2024-07-02T14:17:52.261Z",
                  "deletedAt": "2024-07-02T14:17:52.261Z",
                  "idUsuario": 2,
                  "materiaPrimaProveedores": [
                    "Grano de café"
                  ]
                }
              }
            ],
            "inventarioMps": [
              {
                "id": 2,
                "idMateriaPrima": 2,
                "materiaPrima": "Grano de café",
                "unidadMedida": "kg",
                "cantidad": "15",
                "idCompra": 2,
                "caducidad": "2025-01-01T14:17:52.261Z",
                "estatus": 1,
                "createdAt": "2024-07-02T14:17:52.261Z"
              }
            ],
            "ingredientes": [
              "Grano de café"
            ]
          },
          "cantidad": 10,
          "unidadMedida": "gramos",
          "estatus": 1,
          "createdAt": "2024-07-02T14:17:52.261Z",
          "updatedAt": "2024-07-02T14:17:52.261Z",
          "deletedAt": "2024-07-02T14:17:52.261Z"
        },
        {
          "id": 3,
          "idProducto": 2,
          "producto": "Capuccino",
          "idMateriaPrima": 3,
          "materiaPrima": {
            "id": 3,
            "material": "Leche",
            "estatus": 1,
            "createdAt": "2024-07-02T14:17:52.261Z",
            "updatedAt": "2024-07-02T14:17:52.261Z",
            "deletedAt": "2024-07-02T14:17:52.261Z",
            "materiaPrimaProveedores": [
              {
                "id": 3,
                "materiaPrimaId": 3,
                "materiaPrima": "Leche",
                "proveedorId": 3,
                "proveedor": {
                  "id": 3,
                  "nombreEmpresa": "Lácteos del Campo",
                  "direccionEmpresa": "Calle Tercera 789, Guadalajara",
                  "telefonoEmpresa": "333-789-0123",
                  "nombreEncargado": "Carlos Martínez",
                  "estatus": 1,
                  "createdAt": "2024-07-02T14:17:52.261Z",
                  "updatedAt": "2024-07-02T14:17:52.261Z",
                  "deletedAt": "2024-07-02T14:17:52.261Z",
                  "idUsuario": 3,
                  "materiaPrimaProveedores": [
                    "Leche"
                  ]
                }
              }
            ],
            "inventarioMps": [
              {
                "id": 3,
                "idMateriaPrima": 3,
                "materiaPrima": "Leche",
                "unidadMedida": "litros",
                "cantidad": "50",
                "idCompra": 3,
                "caducidad": "2024-12-01T14:17:52.261Z",
                "estatus": 1,
                "createdAt": "2024-07-02T14:17:52.261Z"
              }
            ],
            "ingredientes": [
              "Leche"
            ]
          },
          "cantidad": 200,
          "unidadMedida": "ml",
          "estatus": 1,
          "createdAt": "2024-07-02T14:17:52.261Z",
          "updatedAt": "2024-07-02T14:17:52.261Z",
          "deletedAt": "2024-07-02T14:17:52.261Z"
        }
      ],
      "inventarioPostres": []
    },
    {
      "id": 3,
      "nombre": "Tarta de Chocolate",
      "precio": 50,
      "descripcion": "Deliciosa tarta con relleno de chocolate",
      "estatus": 1,
      "tipo": "Postre",
      "cantidadXReceta": 1,
      "createdAt": "2024-07-02T14:17:52.261Z",
      "ingredientes": [
        {
          "id": 4,
          "idProducto": 3,
          "producto": "Tarta de Chocolate",
          "idMateriaPrima": 4,
          "materiaPrima": {
            "id": 4,
            "material": "Chocolate",
            "estatus": 1,
            "createdAt": "2024-07-02T14:17:52.261Z",
            "updatedAt": "2024-07-02T14:17:52.261Z",
            "deletedAt": "2024-07-02T14:17:52.261Z",
            "materiaPrimaProveedores": [
              {
                "id": 4,
                "materiaPrimaId": 4,
                "materiaPrima": "Chocolate",
                "proveedorId": 4,
                "proveedor": {
                  "id": 4,
                  "nombreEmpresa": "Chocolates Finos",
                  "direccionEmpresa": "Calle Cuarta 101, Puebla",
                  "telefonoEmpresa": "222-101-1122",
                  "nombreEncargado": "Laura Hernández",
                  "estatus": 1,
                  "createdAt": "2024-07-02T14:17:52.261Z",
                  "updatedAt": "2024-07-02T14:17:52.261Z",
                  "deletedAt": "2024-07-02T14:17:52.261Z",
                  "idUsuario": 4,
                  "materiaPrimaProveedores": [
                    "Chocolate"
                  ]
                }
              }
            ],
            "inventarioMps": [
              {
                "id": 4,
                "idMateriaPrima": 4,
                "materiaPrima": "Chocolate",
                "unidadMedida": "kg",
                "cantidad": "10",
                "idCompra": 4,
                "caducidad": "2025-01-01T14:17:52.261Z",
                "estatus": 1,
                "createdAt": "2024-07-02T14:17:52.261Z"
              }
            ],
            "ingredientes": [
              "Chocolate"
            ]
          },
          "cantidad": 100,
          "unidadMedida": "gramos",
          "estatus": 1,
          "createdAt": "2024-07-02T14:17:52.261Z",
          "updatedAt": "2024-07-02T14:17:52.261Z",
          "deletedAt": "2024-07-02T14:17:52.261Z"
        },
        {
          "id": 5,
          "idProducto": 3,
          "producto": "Tarta de Chocolate",
          "idMateriaPrima": 5,
          "materiaPrima": {
            "id": 5,
            "material": "Harina",
            "estatus": 1,
            "createdAt": "2024-07-02T14:17:52.261Z",
            "updatedAt": "2024-07-02T14:17:52.261Z",
            "deletedAt": "2024-07-02T14:17:52.261Z",
            "materiaPrimaProveedores": [
              {
                "id": 5,
                "materiaPrimaId": 5,
                "materiaPrima": "Harina",
                "proveedorId": 5,
                "proveedor": {
                  "id": 5,
                  "nombreEmpresa": "Harinas del Valle",
                  "direccionEmpresa": "Calle Quinta 202, Oaxaca",
                  "telefonoEmpresa": "951-202-2233",
                  "nombreEncargado": "Miguel Torres",
                  "estatus": 1,
                  "createdAt": "2024-07-02T14:17:52.261Z",
                  "updatedAt": "2024-07-02T14:17:52.261Z",
                  "deletedAt": "2024-07-02T14:17:52.261Z",
                  "idUsuario": 5,
                  "materiaPrimaProveedores": [
                    "Harina"
                  ]
                }
              }
            ],
            "inventarioMps": [
              {
                "id": 5,
                "idMateriaPrima": 5,
                "materiaPrima": "Harina",
                "unidadMedida": "kg",
                "cantidad": "20",
                "idCompra": 5,
                "caducidad": "2025-01-01T14:17:52.261Z",
                "estatus": 1,
                "createdAt": "2024-07-02T14:17:52.261Z"
              }
            ],
            "ingredientes": [
              "Harina"
            ]
          },
          "cantidad": 200,
          "unidadMedida": "gramos",
          "estatus": 1,
          "createdAt": "2024-07-02T14:17:52.261Z",
          "updatedAt": "2024-07-02T14:17:52.261Z",
          "deletedAt": "2024-07-02T14:17:52.261Z"
        }
      ],
      "inventarioPostres": [
        {
          "idPostre": 1,
          "idProducto": 3,
          "producto": "Tarta de Chocolate",
          "cantidad": "5",
          "estatus": 1,
          "createdAt": "2024-07-02T14:17:52.261Z"
        }
      ]
    },
    
  ]

  getProductosPaginados(pagina: number) {
    const inicio = (pagina - 1) * this.cantidadPagina();
    const fin = inicio + this.cantidadPagina();
    return this.productos.slice(inicio, fin);
  }

  getProductos() {
    return this.productos;
  }

  getProducto(id: number) {
    return this.productos.find(producto => producto.id === id);
  }

  addProducto(producto: Producto) {
    this.productos.push(producto);
  }

  updateProducto(producto: Producto) {
    const index = this.productos.findIndex(p => p.id === producto.id);
    this.productos[index] = producto;
  }

  deleteProducto(id: number) {
    this.productos = this.productos.filter(producto => producto.id !== id);
  }

  getProductoByTipo(tipo: TipoProducto) {
    return this.productos.filter(producto => producto.tipo === tipo);
  }
  
}
