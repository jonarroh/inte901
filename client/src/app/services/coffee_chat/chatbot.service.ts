import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = 'http://http://127.0.0.1:5000/send-message'; // Replace with actual API URL

  constructor(private http: HttpClient) {}

  // Function to send a message to the chatbot API
  sendMessage(
    userMessage: string
  ): Observable<{ message: { content: string } }> {
    const payload = {
      model: 'coffee_chat', // Replace with actual model if needed
      messages: [{ role: 'user', content: userMessage }],
      stream: false,
    };

    // Make an HTTP POST request to the chatbot API and return the observable
    return this.http.post<{ message: { content: string } }>(
      this.apiUrl,
      payload
    );
  }
}
