import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PosService } from '../services/pos.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private posService = inject(PosService);
  private router = inject(Router);

  viewState = signal<'login' | 'dashboard'>('login');
  
  products = signal<any[]>([]);
  editingProductId = signal<string | null>(null);

  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  login(user: string, pass: string) {
    if (user === 'admin' && pass === 'admin123') {
      this.errorMessage.set(null);
      this.viewState.set('dashboard');
      this.loadProducts();
    } else {
      this.errorMessage.set('Credenciales inválidas.');
      setTimeout(() => this.errorMessage.set(null), 3000);
    }
  }

  loadProducts() {
    this.isProcessing.set(true);
    this.posService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isProcessing.set(false);
      },
      error: () => this.isProcessing.set(false)
    });
  }

  startEditing(id: string) {
    this.editingProductId.set(id);
  }

  cancelEditing() {
    this.editingProductId.set(null);
  }

  saveProduct(id: string, barcode: string, name: string, price: string, stock: string, expiration: string) {
    this.isProcessing.set(true);
    this.posService.updateProduct(id, { barcode, name, price: Number(price), stock: Number(stock), expiration }).subscribe({
      next: () => {
        this.successMessage.set('Producto actualizado con éxito.');
        this.editingProductId.set(null);
        this.loadProducts();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.isProcessing.set(false);
        this.errorMessage.set('Error actualizando producto.');
        setTimeout(() => this.errorMessage.set(null), 3000);
      }
    });
  }

  logOut() {
    this.viewState.set('login');
  }
  
  goToPos() {
    this.router.navigate(['/']);
  }
}
