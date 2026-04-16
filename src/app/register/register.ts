import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { email, form, FormField, required, minLength } from '@angular/forms/signals';

interface RegisterData { nombre: string; apellido: string; fecha_nacimiento: string; correo: string; contrasena: string; }

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private http = inject(HttpClient);

  goToLogin = output<void>();

  protected isSubmitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  registerModel = signal<RegisterData>({ nombre: '', apellido: '', fecha_nacimiento: '', correo: '', contrasena: '' });
  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.nombre, { message: 'Ingrese un nombre válido' });
    required(schemaPath.apellido, { message: 'Ingrese un apellido válido' });
    required(schemaPath.fecha_nacimiento, { message: 'Fecha obligatoria' });
    required(schemaPath.correo, { message: 'Ingrese un correo válido' });
    email(schemaPath.correo, { message: 'Ingrese un correo válido' });
    required(schemaPath.contrasena, { message: 'Mínimo 6 caracteres' });
    minLength(schemaPath.contrasena, 6, { message: 'Mínimo 6 caracteres' });
  });

  onRegisterSubmit() {
    this.errorMessage.set(null);

    // Manual check for global valid 
    if (
      this.registerForm.nombre().invalid() ||
      this.registerForm.apellido().invalid() ||
      this.registerForm.fecha_nacimiento().invalid() ||
      this.registerForm.correo().invalid() ||
      this.registerForm.contrasena().invalid()
    ) {
      this.errorMessage.set('Por favor, complete los campos correctamente.');
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      nombre: this.registerForm.nombre().value(),
      apellido: this.registerForm.apellido().value(),
      fecha_nacimiento: this.registerForm.fecha_nacimiento().value(),
      correo: this.registerForm.correo().value(),
      contrasena: this.registerForm.contrasena().value()
    };

    this.http.post('http://localhost:5001/api/auth/register', payload)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(response.message || 'Registro exitoso. Puedes iniciar sesión.');
          this.registerModel.set({ nombre: '', apellido: '', fecha_nacimiento: '', correo: '', contrasena: '' });
          setTimeout(() => this.goToLogin.emit(), 1500);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(error.error?.error || 'Error del servidor al registrar el usuario.');
        }
      });
  }
}
