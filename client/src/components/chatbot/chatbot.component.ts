import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '~/app/services/chatbot.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

  private messagesSubject = new BehaviorSubject(this.messages);
  messages$ = this.messagesSubject.asObservable();

  constructor(private chatbotService: ChatbotService) {} // Inject the chatbot service

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

  // Función para responder al usuario usando el servicio
  respondToUser(userMessage: string) {
    this.chatbotService
      .sendMessage(userMessage)
      .pipe(
        tap((response) => {
          this.messages.push({ text: response.message.content, isUser: false });
          this.messagesSubject.next(this.messages); // Update the message list
        }),
        catchError((error) => {
          // Handle the error case and log the actual error
          const errorMessage = error?.message || 'Unknown error occurred';

          this.messages.push({
            text: `Error: ${errorMessage}`, // Include the real error message
            isUser: false,
          });
          this.messagesSubject.next(this.messages); // Update the message list

          return of(); // Return an empty observable to keep the stream alive
        })
      )
      .subscribe();
  }
}
