import { id } from "date-fns/locale";

export interface LocationDTO {
  latitude: number;   // La latitud debe ser un número
  longitude: number;  // La longitud debe ser un número
  isLogged: number;   // isLogged debe ser un número
  token: string;      // El token debe ser una cadena de texto
  browser: string;   // El navegador debe ser una cadena de texto
  deviceType: string;// El tipo de dispositivo debe ser una cadena de texto
}

export interface Location extends LocationDTO {
  id: number;         
}