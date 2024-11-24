import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../../services/user.service'; 
import { IForum } from '../../models/iforum';
import { ForumService } from '../../services/forum.service';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  forums: IForum[] = [];
  visible: boolean = false;
  password: string = '';
  constructor(
    readonly userService: UserService,
    readonly forumService: ForumService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getForumSuggestions().subscribe((data) => {
        console.log(data);
        this.forums = data;
      });
    } else {
      console.warn('Not running in the browser, skipping data loading in GroupComponent');
    }
  }

  joinGroup(id_forum: number, password?: string): void {

    if(this.forums.find(forum => forum.id_forum == id_forum)?.privacy == 'Privado'){
      this.showDialog();
    } else {
      this.forumService.joinForum(id_forum, password).subscribe({
      next: () => {
        this.toastr.success('Unido al grupo');
      },
      error: (err) => {
        console.error('Error al unirse al grupo:', err);
        this.toastr.error('Error al unirse al grupo');
        }
      });
    }
  }

  showDialog() {
    this.visible = true;
  }

}
