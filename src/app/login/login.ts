import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);

  goToRegister = output<void>();

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

    // Simulate network request
    setTimeout(() => {
      console.log('Login credentials:', payload);
      this.isSubmitting.set(false);
      this.errorMessage.set('Login exitoso. Funcionalidad backend pendiente.');
    }, 1500);
  }
}
