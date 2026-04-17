import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { email, form, FormField, required, minLength } from '@angular/forms/signals';

interface LoginData { email: string; password: string; }

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  goToRegister = output<void>();
  goToForgot = output<void>();

  protected isSubmitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  loginModel = signal<LoginData>({ email: '', password: '' });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Ingrese un correo válido' });
    email(schemaPath.email, { message: 'Ingrese un correo válido' });
    required(schemaPath.password, { message: 'Mínimo 6 caracteres' });
    minLength(schemaPath.password, 6, { message: 'Mínimo 6 caracteres' });
  });

  onSubmit() {
    this.errorMessage.set(null);

    // If there's a global valid, we use it. Otherwise, we check manually.
    if (this.loginForm.email().invalid() || this.loginForm.password().invalid()) {
      this.errorMessage.set('Por favor, revise los campos marcados.');
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      email: this.loginForm.email().value(),
      password: this.loginForm.password().value()
    };

    this.authService.login(payload)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(null);
          this.router.navigate(['/pos']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const msg = err.error?.error || 'Error de conexión con el servidor.';
          this.errorMessage.set(msg);
        }
      });
  }
}
