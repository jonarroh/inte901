import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from './interface/chat';
import { ENDPOINTS } from '~/lib/endpoint';

@Injectable({
  providedIn: 'root',
})
export class HistorialChatsService {
  apiUrl = ENDPOINTS.chat; // Cambia por tu URL de la API

  constructor(private http: HttpClient) {}

  // Obtener todos los chats
  getChats = (): Observable<Chat[]> => this.http.get<Chat[]>(`${this.apiUrl}`);

  // Crear un nuevo chat
  postChat(data: Chat): Observable<Chat> {
    return this.http.post<Chat>(this.apiUrl, data);
  }

  // Obtener un chat por ID
  getChatById(id: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/${id}`);
  }
}
