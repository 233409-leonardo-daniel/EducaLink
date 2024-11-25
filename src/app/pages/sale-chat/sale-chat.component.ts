import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUserData } from '../../models/iuser-data';
import { IMessage } from '../../models/imessage';
import { IChat } from '../../models/ichat';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ISaleMessage } from '../../models/isale-message';
import { ISaleChat } from '../../models/isale-chat';

@Component({
  selector: 'app-sale-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './sale-chat.component.html',
  styleUrl: './sale-chat.component.css'
})
export class SaleChatComponent implements OnInit {
  chats: ISaleChat[] = [];
  // currentUser: IUserData = {} as IUserData;
  currentChatUser: IUserData | null = null;
  messages: ISaleMessage[] = [];
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
    this.chatService.getSaleChatUsers(id_user).subscribe({
      next: (chats: ISaleChat[]) => {
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
    
    const chat = this.chats.find(c => c.id_sale_chat === chatId);
    if (chat) {
      const receiverId = chat.buyer.id_user;
      this.userService.getUserById(receiverId).subscribe(user => {
        this.currentChatUser = user;
      });
    }

    this.chatService.getSaleMessagesByChatId(chatId).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage(chatId: number) {
    if (this.selectedChatId !== null && this.messageForm.valid) {
     
      this.chatService.createSaleMessage({message: this.messageForm.value.message, chat_id: chatId}).subscribe(message => {
        this.messages.push(message);
        this.messageForm.reset();

      });
    } else {
      console.warn('No hay chat seleccionado o el mensaje está vacío.');
    }
  }
}
