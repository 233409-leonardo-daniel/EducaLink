import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from '../../group/group.component';

@Component({
  selector: 'app-register-group',
  standalone: true,
  imports: [GroupComponent],
  templateUrl: './register-group.component.html',
  styleUrl: './register-group.component.css'
})
export class RegisterGroupComponent {
  finalize(): void {
    alert('Finalizado');
  }

}
