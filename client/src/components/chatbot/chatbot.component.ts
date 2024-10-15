import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  messages = [
    { text: 'hello', isUser: true },
    { text: 'This is a response from the chatbot.', isUser: false },
    { text: 'this example of chat', isUser: true },
    { text: 'This is a response from the chatbot.', isUser: false },
  ];

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
  }

  // Responde al usuario (puedes agregar la lógica del bot aquí)
  respondToUser(userMessage: string) {
    setTimeout(() => {
      this.messages.push({
        text: 'This is a response from the chatbot.',
        isUser: false,
      });
    }, 500);
  }
}
