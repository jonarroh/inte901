import { HttpClient } from "@angular/common/http";
import { LocationDTO } from ".";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private ws: WebSocket | null = null; 
  public apiUrl = 'http://191.101.1.86:3000/location';
  public location: LocationDTO | null = null;

  constructor(private http: HttpClient) {
    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    this.ws = new WebSocket('ws://191.101.1.86:3000/ws');

    this.ws.onopen = () => {
      console.log('Conexión WebSocket abierta');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(`Mensaje recibido del servidor:`, message);
      if (message.type === 'welcome') {
        console.log('Mensaje de bienvenida:', message.data);
      }
    };

    this.ws.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    this.ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };
  }

  isServiceAvailable(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation no es soportado por este navegador.'));
      }
    });
  }

  createAnonymousToken(): string {
    if (this.getAnonymousToken()) {
      return this.getAnonymousToken();
    }

    let anonymousToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('anonymousToken', anonymousToken);
    return anonymousToken;
  }

  getDeviceName(): { browser: string; deviceType: string } {
    const userAgent = navigator.userAgent;
    
    let browser = 'Unknown';
    let deviceType = 'Unknown';
  
    // Detectar el navegador
    if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edg')) {
      browser = 'Edge';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      browser = 'Internet Explorer';
    }
  
    // Detectar el tipo de dispositivo
    if (/iPhone/i.test(userAgent)) {
      deviceType = 'iPhone';
    } else if (/Android/i.test(userAgent)) {
      deviceType = 'Mobile';
    } else if (/iPad|Tablet/i.test(userAgent)) {
      deviceType = 'Tablet';
    } else if (/Mobile/i.test(userAgent)) {
      deviceType = 'Mobile';
    } else {
      deviceType = 'Desktop';
    }
  
    return {
      browser,
      deviceType
    };
  }
  isLogged(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token.length > "6zecqdqehhsarsvyvz4dk".length;
  }

  saveAnonymousToken(token: string): void {
    localStorage.setItem('anonymousToken', token);
  }

  getAnonymousToken(): string {
    return localStorage.getItem('anonymousToken') || '';
  }

  deleteLocation(token: string): void {
    this.http.delete(`${this.apiUrl}/${token}`).subscribe({
      next: (response) => {
        console.log('Ubicación eliminada correctamente:', response);
      },
      error: (error) => {
        console.error('Error al eliminar la ubicación:', error);
      }
    });
  }

  sendLocation({ latitude, longitude, isLogged, token, browser, deviceType }: LocationDTO): void {
    if (this.isServiceAvailable()) {
      console.log('Enviando ubicación a través de WebSocket...');
      const message = {
        type: 'onLogin',
        latitude: latitude,
        isLogged: isLogged,
        longitude: longitude,
        token: token,
        browser: browser,
        deviceType: deviceType
      };

      if (this.ws) {
        this.ws.send(JSON.stringify(message));
      } else {
        console.error('WebSocket no está disponible.');
      }
      console.log('Datos de inicio de sesión enviados a través de WebSocket:', message);
    } else {
      console.error('WebSocket no está abierto. No se puede enviar la ubicación.');
    }
  }
}
