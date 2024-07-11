import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '~/lib/types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userId = localStorage.getItem('userId') ?? null;

  userData: User | null = null;

  constructor(private http: HttpClient) {}


  endpoint = 'https://localhost:7268/api/Users'


  getUser() {
    return this.http.get<User>(`${this.endpoint}/${this.userId}`);
  }

  clearUserData() {
    this.userData = null;
    localStorage.removeItem('userId');
  }

}