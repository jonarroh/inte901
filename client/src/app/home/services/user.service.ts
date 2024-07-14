import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { User } from '~/lib/types';

const defaultUser: User = {
  id: 0,
  name: '',
  email: '',
  creditCards: [],
  direcciones: [],
  lastName: '',
  password: '',
  role: '',
  token: '',
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private storageKey = 'userData';

  userId = localStorage.getItem('userId') ?? null;

  userData = signal<User>(this.loadUserDataFromLocalStorage() || defaultUser);

  constructor(private http: HttpClient) {
    window.addEventListener('storage', this.syncUserDataAcrossTabs.bind(this));
  }

  endpoint = 'https://localhost:7268/api/Users';

  private syncUserDataAcrossTabs(event: StorageEvent): void {
    if (event.key === this.storageKey) {
      const newUserData = event.newValue ? JSON.parse(event.newValue) : defaultUser;
      this.userData.set(newUserData);
    }
  }

  private loadUserDataFromLocalStorage(): User | null {
    const savedUserData = localStorage.getItem(this.storageKey);
    return savedUserData ? JSON.parse(savedUserData) : null;
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }

  saveUserData(userData: User) {
    this.userData.set(userData);
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
  }

  clearUserData() {
    this.userData.set(defaultUser);
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('userId');
  }
}
