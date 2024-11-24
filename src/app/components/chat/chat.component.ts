import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { IChat } from '../../models/ichat';
import { IMessage } from '../../models/imessage';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { IUserData } from '../../models/iuser-data';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit {
  chats: IChat[] = [];
  // currentUser: IUserData = {} as IUserData;
  currentChatUser: IUserData | null = null;
  messages: IMessage[] = [];
  newMessage: string = '';
  selectedChatId: number | null = null;
  user: IUserData = {} as IUserData;
  messageForm: FormGroup;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService
  ) { 
    this.messageForm = new FormGroup({
      message: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    this.getChatUsers();
  }

  getChatUsers() {
    const id_user = this.user.id_user; 
    this.chatService.getChatUsers(id_user).subscribe({
      next: (chats: IChat[]) => {
        this.chats = chats;
        console.log(this.chats);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  

  selectChat(chatId: number) {
    this.selectedChatId = chatId;
    const chat = this.chats.find(c => c.id_chat === chatId);
    if (chat) {
      const receiverId = chat.receiver.id_user;
      this.userService.getUserById(receiverId).subscribe(user => {
        this.currentChatUser = user;
      });
    }

    this.chatService.getMessagesByChatId(chatId).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage(chatId: number) {
    if (this.selectedChatId !== null && this.messageForm.valid) {
     
      this.chatService.createMessage({message: this.messageForm.value.message, chat_id: chatId}).subscribe(message => {
        this.messages.push(message);
        this.messageForm.reset();

      });
    } else {
      console.warn('No hay chat seleccionado o el mensaje está vacío.');
    }
  }
  
}
