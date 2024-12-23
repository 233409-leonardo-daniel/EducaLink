// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChat } from '../models/ichat';
import { IMessage } from '../models/imessage';
import { AuthService } from '../auth/auth.service';
import { ISaleMessage } from '../models/isale-message';
import { ISaleChat } from '../models/isale-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://98.85.11.22:8000';
  // private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient, private authService:AuthService) {}

  getChatById(id_chat: number): Observable<IChat> {
    return this.http.get<IChat>(`${this.apiUrl}/chat/${id_chat}`,this.authService.getHttpOptions());
  }

  getChatUsers(id_user: number): Observable<IChat[]> {
    return this.http.get<IChat[]>(`${this.apiUrl}/chat/user/${id_user}`,this.authService.getHttpOptions());
  }

  getMessagesByChatId(chat_id: number): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(`${this.apiUrl}/message/chat/${chat_id}`,this.authService.getHttpOptions());
  }

  getMessageById(id_message: number): Observable<IMessage> {
    return this.http.get<IMessage>(`${this.apiUrl}/message/${id_message}`,this.authService.getHttpOptions());
  }

  createChat(receiver_id: number): Observable<IChat> {
    return this.http.post<IChat>(`${this.apiUrl}/chat/${receiver_id}/`, {}, this.authService.getHttpOptions());
  }

  createMessage(messageData: { message: string; chat_id: number }): Observable<IMessage> {
    return this.http.post<IMessage>(`${this.apiUrl}/message/${messageData.chat_id}/`, null, {
        params: { message: messageData.message },
        headers: this.authService.getHttpOptions().headers
    });
  }

  createSaleChat(receiver_id: number): Observable<ISaleChat> {
    return this.http.post<ISaleChat>(`${this.apiUrl}/sale_chat/${receiver_id}/`, {}, this.authService.getHttpOptions());
  }

  getSaleChatUsers(id_user: number): Observable<ISaleChat[]> {
    return this.http.get<ISaleChat[]>(`${this.apiUrl}/sale_chat/user/${id_user}`,this.authService.getHttpOptions());
  }

  getSaleMessagesByChatId(chat_id: number): Observable<ISaleMessage[]> {
    return this.http.get<ISaleMessage[]>(`${this.apiUrl}/sale_message/chat/${chat_id}`,this.authService.getHttpOptions());
  }

  createSaleMessage(messageData: { message: string; chat_id: number }): Observable<ISaleMessage> {
    return this.http.post<ISaleMessage>(`${this.apiUrl}/sale_message/${messageData.chat_id}/`, null, {
        params: { message: messageData.message },
        headers: this.authService.getHttpOptions().headers
    });
  }
}
