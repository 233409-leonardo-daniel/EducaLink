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
  currentUser: IUserData = {} as IUserData;
  currentChatUser: IUserData | null = null;
  messages: IMessage[] = [];
  newMessage: string = '';
  selectedChatId: number | null = null;

  constructor(private chatService: ChatService, private userService: UserService) {
    this.currentUser = this.userService.getData();
  }

  ngOnInit(): void {
    this.getChatUsers();
  }

  getChatUsers() {
    const id_user = this.currentUser.id_user; 
    this.chatService.getChatUsers(id_user).subscribe(chats => {
      this.chats = chats.map(chat => {       
        const otherUserId = chat.sender_id === id_user ? chat.receiver_id : chat.sender_id;
        this.userService.getUserById(otherUserId).subscribe(user => {
          chat.displayName = `${user.name} ${user.lastname}`; 
        });
  
        return chat;
      });
    });
  }
  

  selectChat(chatId: number) {
    this.selectedChatId = chatId;
    const chat = this.chats.find(c => c.id_chat === chatId);
    if (chat) {
      const receiverId = chat.receiver_id;
      this.userService.getUserById(receiverId).subscribe(user => {
        this.currentChatUser = user;
      });
    }

    this.chatService.getMessagesByChatId(chatId).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.selectedChatId !== null && this.newMessage.trim() !== '') {
      const newMessage: IMessage = {
        message: this.newMessage,
        chat_id: this.selectedChatId,
        date_message: new Date().toISOString(),
        id_message: 0,
        sender_id: this.currentUser.id_user
      };
      this.chatService.createMessage(newMessage).subscribe(message => {
        this.messages.push(message);
        this.newMessage = '';
      });
    } else {
      console.warn('No hay chat seleccionado o el mensaje está vacío.');
    }
  }
  
}
