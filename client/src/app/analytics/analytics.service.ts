import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  getDeviceInfo(): any {
    //@ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const isMobile = /Mobi|Android/i.test(userAgent) ? 1 : 0;
    const isAndroid = /Android/i.test(userAgent) ? 1 : 0;
    const isIPhone = /iPhone|iPad|iPod/i.test(userAgent) ? 1 : 0;
    const isWindows = /Windows/i.test(userAgent) ? 1 : 0;
    const isMac = /Macintosh/i.test(userAgent) ? 1 : 0;

    return {
      isMobile,
      isAndroid,
      isIPhone,
      isWindows,
      isMac
    };
  }

  sendDeviceInfoToEndpoint(endpointUrl: string): Observable<any> {
    const deviceInfo = this.getDeviceInfo();
    return this.http.post(endpointUrl, { device: deviceInfo });
  }


}
