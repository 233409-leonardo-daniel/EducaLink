import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { IChat } from '../../models/ichat';
import { IMessage } from '../../models/imessage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { IUserData } from '../../models/iuser-data';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit {
  chats: IChat[] = [];
  currentUser: IUserData = {} as IUserData
  messages: IMessage[] = [];
  newMessage: string = ''; // Definimos newMessage como un string vacío
  selectedChatId: number | null = null; // Definimos selectedChatId como null inicialmente

  constructor(private chatService: ChatService, private userService: UserService) {
    this.currentUser = this.userService.getData();
    console.log(this.currentUser)
  }

  ngOnInit(): void {
    this.getChatUsers();
  }

  getChatUsers() {
    const id_user = this.userService.getData().id_user; 
    this.chatService.getChatUsers(id_user).subscribe(chats => {
      console.log(chats)
      this.chats = chats;
    });
  }
  
  selectChat(chatId: number) {
    this.selectedChatId = chatId; 
    console.log(this.selectedChatId)
    this.chatService.getMessagesByChatId(chatId).subscribe(messages => {
      console.log(messages)
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.selectedChatId !== null && this.newMessage.trim() !== '') {
      const newMessage: IMessage = {
        message: this.newMessage,
        chat_id: this.selectedChatId, // `selectedChatId` ya está validado
        date_message: new Date().toISOString(),
        id_message: 0,
        sender_id : this.currentUser.id_user
      };
      this.chatService.createMessage(newMessage).subscribe(message => {
        this.messages.push(message);
        this.newMessage = ''; // Limpiamos el input después de enviar el mensaje
      });
    } else {
      console.warn('No hay chat seleccionado o el mensaje está vacío.');
    }
  }
  
}
