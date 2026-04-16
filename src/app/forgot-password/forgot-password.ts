import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormField],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  
  goToLogin = output<void>();

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  forgotModel = signal({ email: '' });
  forgotForm = form(this.forgotModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Ingrese un correo válido' });
    email(schemaPath.email, { message: 'Ingrese un correo válido' });
  });

  onSubmit() {
    this.errorMessage.set(null);
    if (this.forgotForm.email().invalid()) {
      this.errorMessage.set('Por favor, ingrese un correo válido.');
      return;
    }
    
    this.isSubmitting.set(true);
    const payload = { email: this.forgotForm.email().value() };

    this.authService.forgotPassword(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(res.message);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.error || 'Error de conexión con el servidor.');
      }
    });
  }
}
