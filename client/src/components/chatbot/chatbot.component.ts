import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '~/app/services/coffee_chat/chatbot.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { HistorialChatsService } from '~/app/services/coffee_chat/historial-chats.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  isChatboxOpen = false; // Estado del chatbox

  userMessage = ''; // Mensaje del usuario
  messages: { text: string; isUser: boolean }[] = [];
  conversacionId: string;
  userId: number | null;

  private messagesSubject = new BehaviorSubject(this.messages);
  messages$ = this.messagesSubject.asObservable();

  constructor(
    private chatbotService: ChatbotService,
    private historialChatsService: HistorialChatsService
  ) {
    this.conversacionId = this.generateConversacionId();
    this.userId = Number(this.getUserIdFromLocalStorage());
  } // Inject the chatbot service

  private generateConversacionId(): string {
    return uuidv4();
  }

  // Función para alternar el estado del chatbox
  toggleChatbox() {
    this.isChatboxOpen = !this.isChatboxOpen;
  }

  // Función para enviar un mensaje
  sendMessage() {
    if (this.userMessage.trim() !== '') {
      this.addUserMessage(this.userMessage);
      this.respondToUser(this.userMessage);
      this.userMessage = ''; // Limpia el input
    }
  }

  // Añade el mensaje del usuario al chat
  addUserMessage(message: string) {
    this.messages.push({ text: message, isUser: true });
    this.messagesSubject.next(this.messages); // Update the message list
  }

  private getUserIdFromLocalStorage(): string | null {
    return localStorage.getItem('userId');
  }

  respondToUser(userMessage: string) {
    const currentDate = new Date(); // Fecha actual en formato ISO

    // Si el userId existe en el localStorage, guardar el historial
    if (this.userId) {
      // Guardar el mensaje del usuario en el historial
      this.historialChatsService
        .postChat({
          idUsuario: this.userId,
          mensaje: userMessage,
          rol: 'user',
          fecha: currentDate,
          conversacionId: this.conversacionId,
        })
        .subscribe();

      // Luego, hacer la petición al chatbot
      this.makeChatbotRequest(userMessage, currentDate);
    } else {
      // Si no hay userId, continuar como antes
      this.makeChatbotRequest(userMessage, currentDate);
    }
  }

  private makeChatbotRequest(userMessage: string, currentDate: Date) {
    this.chatbotService
      .sendMessage(userMessage)
      .pipe(
        tap((response) => {
          const botResponse = response.message.content;
          if (this.userId) {
            this.historialChatsService
              .postChat({
                idUsuario: this.userId,
                mensaje: botResponse,
                rol: 'assistant',
                fecha: currentDate,
                conversacionId: this.conversacionId,
              })
              .subscribe();
          }

          // Añadir la respuesta a la interfaz
          this.messages.push({ text: botResponse, isUser: false });
          this.messagesSubject.next(this.messages); // Actualiza la lista de mensajes
        }),
        catchError((error) => {
          // Manejo de errores
          const errorMessage = error?.message || 'Unknown error occurred';
          this.messages.push({
            text: `Error: ${errorMessage}`,
            isUser: false,
          });
          this.messagesSubject.next(this.messages); // Actualiza la lista de mensajes
          return of(); // Retorna un observable vacío para mantener el stream activo
        })
      )
      .subscribe();
  }
}
