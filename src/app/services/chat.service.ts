// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChat } from '../models/ichat';
import { IMessage } from '../models/imessage';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000'; // Reemplaza con tu URL de API

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

  createChat(chat: IChat): Observable<IChat> {
    console.log(chat);
    return this.http.post<IChat>(`${this.apiUrl}/chat/`, chat, this.authService.getHttpOptions());
  }

  createMessage(message: IMessage): Observable<IMessage> {
    console.log(message);
    
    return this.http.post<IMessage>(`${this.apiUrl}/message/`, message, this.authService.getHttpOptions());
  }
}
