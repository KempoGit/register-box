import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { LoginComponent } from '../login/login';
import { RegisterComponent } from '../register/register';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  currentView = signal<'login' | 'register' | 'forgot'>('login');

  setView(view: 'login' | 'register' | 'forgot') {
    this.currentView.set(view);
  }
}

