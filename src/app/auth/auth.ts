import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { LoginComponent } from '../login/login';
import { RegisterComponent } from '../register/register';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  isRegistering = signal(false);

  toggleRegister() {
    this.isRegistering.update(val => !val);
  }
}

