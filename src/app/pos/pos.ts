import { Component, ChangeDetectionStrategy, signal, computed, inject, effect, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ScannerService } from '../services/scanner.service';
import { PosService } from '../services/pos.service';
import { Router } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';

interface CartItem {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './pos.html',
  styleUrl: './pos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosComponent {
  private scanner = inject(ScannerService);
  private posService = inject(PosService);
  private router = inject(Router);

  @ViewChild('manualScan') manualScanInput?: ElementRef<HTMLInputElement>;

  // Atrapa el tipeo humano o láser inclusive si dimos clic fuera del input
  @HostListener('window:keydown', ['$event'])
  forceFocus(event: KeyboardEvent) {
    if (this.viewState() === 'pos' && this.manualScanInput) {
      if (document.activeElement !== this.manualScanInput.nativeElement) {
        // Evitamos robar el foco si pulsa F5, Shift, Ctrl, etc.
        if (event.key.length === 1) {
          this.manualScanInput.nativeElement.focus();
        }
      }
    }
  }

  viewState = signal<'pos' | 'history' | 'add'>('pos');
  
  cartItems = signal<CartItem[]>([]);
  lastProduct = signal<CartItem | null>(null);
  
  subTotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  salesHistory = signal<any[]>([]);
  expandedSaleId = signal<string | null>(null);

  constructor() {}

  private setTempMessage(type: 'error'|'success', msg: string) {
    if (type === 'error') this.errorMessage.set(msg);
    else this.successMessage.set(msg);
    setTimeout(() => {
      this.errorMessage.set(null);
      this.successMessage.set(null);
    }, 3500);
  }

  processBarcode(rawInput: string) {
    if (!rawInput) return;
    
    let quantityToAdd = 1;
    let isSubtraction = false;
    let barcode = rawInput.trim();

    // 1. Detectar resta con multiplicador ej: -3 123123123
    const subMatchMulti = barcode.match(/^-(?:\s*)?(\d+)\s+(.+)$/);
    // 2. Detectar suma con multiplicador ej: *3 123123123
    const addMatchMulti = barcode.match(/^\*(\d+)\s+(.+)$/);

    if (subMatchMulti) {
      isSubtraction = true;
      quantityToAdd = parseInt(subMatchMulti[1], 10);
      barcode = subMatchMulti[2].trim();
    } else if (addMatchMulti) {
      quantityToAdd = parseInt(addMatchMulti[1], 10);
      barcode = addMatchMulti[2].trim();
    } else if (barcode.startsWith('-')) {
      // 3. Detectar resta simple ej: - 123123123  o  -123123123
      isSubtraction = true;
      quantityToAdd = 1;
      barcode = barcode.substring(1).trim();
    }

    const existing = this.cartItems().find(item => item.barcode === barcode);

    // Flujo de Resta (Eliminación de ítems)
    if (isSubtraction) {
      if (!existing) {
        this.setTempMessage('error', 'El producto no está en el carrito.');
        return;
      }
      if (existing.quantity < quantityToAdd) {
        this.setTempMessage('error', `No hay suficientes productos. Solo tienes ${existing.quantity}.`);
        return;
      }
      
      if (existing.quantity === quantityToAdd) {
        // Eliminar del carrito completamente
        this.cartItems.update(items => items.filter(item => item.barcode !== barcode));
        if (this.lastProduct()?.barcode === barcode) {
          this.lastProduct.set(null); 
        }
      } else {
        // Reducir la cantidad
        this.cartItems.update(items => items.map(item => 
          item.barcode === barcode ? { ...item, quantity: item.quantity - quantityToAdd } : item
        ));
      }
      this.setTempMessage('success', 'Producto removido del carrito.');
      return;
    }

    // Flujo de Suma (Suma de ítems)
    if (existing) {
      this.cartItems.update(items => items.map(item => 
        item.barcode === barcode ? { ...item, quantity: item.quantity + quantityToAdd } : item
      ));
      this.lastProduct.set(existing);
      return;
    }

    this.isProcessing.set(true);
    this.posService.getProduct(barcode).subscribe({
      next: (product) => {
        this.isProcessing.set(false);
        const newItem: CartItem = { 
          barcode: product.barcode, 
          name: product.name, 
          price: product.price, 
          quantity: quantityToAdd 
        };
        this.cartItems.update(items => [...items, newItem]);
        this.lastProduct.set(newItem);
      },
      error: () => {
        this.isProcessing.set(false);
        this.setTempMessage('error', `Producto no encontrado: ${barcode}`);
      }
    });
  }

  nextPurchase() {
    if (this.cartItems().length === 0) return;
    
    this.isProcessing.set(true);
    const sale = { items: this.cartItems(), total: this.subTotal() };

    this.posService.checkout(sale).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.cartItems.set([]);
        this.lastProduct.set(null);
        this.setTempMessage('success', '¡Venta facturada con éxito!');
      },
      error: () => {
        this.isProcessing.set(false);
        this.setTempMessage('error', 'Error del servidor cerrando compra.');
      }
    });
  }

  viewHistory() {
    this.viewState.set('history');
    this.expandedSaleId.set(null); // Resetear acordeón
    this.posService.getSales().subscribe(res => this.salesHistory.set(res));
  }

  toggleSale(id: string) {
    this.expandedSaleId.update(current => current === id ? null : id);
  }

  showAddProduct() {
    this.viewState.set('add');
  }

  saveNewProduct(barcode: string, name: string, price: string) {
    if (!barcode || !name || !price) return;
    this.isProcessing.set(true);
    this.posService.addProduct({ barcode, name, price: Number(price) }).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.setTempMessage('success', 'Producto guardado en inventario.');
        this.viewState.set('pos');
      },
      error: () => {
        this.isProcessing.set(false);
        this.setTempMessage('error', 'Error. El código podría estar ya registrado.');
      }
    });
  }

  closeView() {
    this.viewState.set('pos');
  }

  logOut() {
    this.router.navigate(['/']);
  }
}
