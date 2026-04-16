import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { email, form, FormField, required, minLength } from '@angular/forms/signals';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormField],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  token = signal<string>('');

  resetModel = signal({ password: '', confirmPassword: '' });
  resetForm = form(this.resetModel, (schemaPath) => {
    required(schemaPath.password, { message: 'Requerido' });
    minLength(schemaPath.password, 6, { message: 'Mínimo 6 caracteres' });
    required(schemaPath.confirmPassword, { message: 'Requerido' });
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token.set(params.get('token') || '');
    });
  }

  onSubmit() {
    this.errorMessage.set(null);
    if (this.resetForm.password().invalid() || this.resetForm.confirmPassword().invalid()) {
      this.errorMessage.set('Por favor, revise los campos.');
      return;
    }

    const newPass = this.resetForm.password().value();
    const confPass = this.resetForm.confirmPassword().value();

    if (newPass !== confPass) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.isSubmitting.set(true);
    const payload = { token: this.token(), newPassword: newPass };

    this.authService.resetPassword(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(res.message);
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.error || 'Error del servidor');
      }
    });
  }
}
