const API_URL = 'http://localhost:5275';

export const ENDPOINTS = {
  login: `${API_URL}/Account/login`,
  logout: `${API_URL}/Account/logout`,
  test: `${API_URL}/Home/protected`,
  producto: `${API_URL}/api/Productos`,
  compras: `${API_URL}/api/Purchases`,
  materia_prima: `${API_URL}/api/MateriasPrimas`,
  ingrediente: `${API_URL}/api/Ingredientes`,
  proveedor: `${API_URL}/api/Proveedores`,
  materiaPrimaProveedor: `${API_URL}/api/MateriasPrimasProveedores`,
  ventas: `${API_URL}/api/Orders`,
  inventarioMP: `${API_URL}/api/InventarioMPs`,
  inventarioPostre: `${API_URL}/api/InventarioPostres`,
  promociones: `${API_URL}/api/Promociones`,
  chat: `${API_URL}/api/Chats`,
} as const;
