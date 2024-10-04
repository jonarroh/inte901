import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { User, UserEditDTO } from '~/lib/types';

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
  estatus: 'Activo',
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private storageKey = 'userData';

  userId = localStorage.getItem('userId') ?? null;

  imgUrl = signal<string | null>(
    `http://localhost:5000/static/users/${this.userId}.webp`
  );

  userData = signal(this.loadUserDataFromLocalStorage() || defaultUser);

  constructor(private http: HttpClient) {
    window.addEventListener('storage', this.syncUserDataAcrossTabs.bind(this));
  }

  endpoint = 'http://localhost:5275/api/Users';

  private syncUserDataAcrossTabs(event: StorageEvent): void {
    if (event.key === this.storageKey) {
      const newUserData = event.newValue
        ? JSON.parse(event.newValue)
        : defaultUser;
      this.userData.set(newUserData);
    }
  }

  private loadUserDataFromLocalStorage(): User | null {
    const savedUserData = localStorage.getItem(this.storageKey);
    return savedUserData ? JSON.parse(savedUserData) : null;
  }

  syncUserData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getUser(+userId).subscribe({
        next: (user) => {
          this.saveUserData(user);
          console.log('Usuario cargado correctamente', this.userData()?.id);
        },
        error: (error) => {
          console.error('Error al cargar el usuario', error);
        },
      });
    }
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }

  saveUserData(userData: User) {
    this.userData.set(defaultUser);
    localStorage.removeItem(this.storageKey);
    this.userData.set(userData);
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
    localStorage.setItem('userId', userData.id.toString());
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  clearUserData() {
    this.userData.set(defaultUser);
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('userId');
  }

  deleteUser(id: number) {
    return this.http.delete<User>(`${this.endpoint}/${id}`);
  }

  editTempImage(image: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(image);
  }

  updateUser(userData: UserEditDTO) {
    console.log(userData.Image);
    const formData = new FormData();
    formData.append('Id', userData.id.toString());
    formData.append('Name', userData.name);
    formData.append('LastName', userData.lastName);
    formData.append('Email', userData.email);
    if (userData.newPassword && userData.actualPassword) {
      formData.append('NewPassword', userData.newPassword);
      formData.append('ActualPassword', userData.actualPassword);
    }
    if (userData.Image) {
      formData.append('Image', userData.Image);
    }
    if (userData.direcciones) {
      formData.append('Direcciones', JSON.stringify(userData.direcciones));
    }
    if (userData.creditCards) {
      formData.append('CreditCards', JSON.stringify(userData.creditCards));
    }

    return this.http.put<User>(`${this.endpoint}/${userData.id}`, formData);
  }

  createUser(userData: User) {
    return this.http.post<User>(`${this.endpoint}`, userData);
  }

  getAllUsers() {
    return this.http.get<User[]>(`${this.endpoint}`);
  }
}
