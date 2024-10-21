import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushService {

   PUBLIC_KEY = "BF49Q8-umWIiw5RL2l5LH3uBEtjc1-2wDyZVAgxQERcKecJeKzjktrjQSIDwwYk3PitG2kBrRBXjT5AAaoO5PK0"
   URL = "http://localhost:3000/web/subscribe"

  constructor() {
    console.log("Service Push");
    this.subscription()
    this.pushMessage({title: "Hola", message: "Mundo", url: "https://www.google.com"})
   }


  subscription = async() =>{

    //service worker
    const register = navigator.serviceWorker.register('/worker.js',{
      scope: '/'
    })

    console.log("Service Worker registrado");

    //push manager
    const subscription = await register.then((sw) => {
      return sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(this.PUBLIC_KEY)
      })
    })


    await fetch(this.URL, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    })

  }

  pushMessage = async({title, message,url}: {title: string, message: string, url: string}) => {
    await fetch('http://localhost:3000/web/push', {
      method: 'POST',
      body: JSON.stringify({title, message,url}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  urlB64ToUint8Array = (base64String:string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

}
