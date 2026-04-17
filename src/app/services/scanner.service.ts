import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private barcodeBuffer = '';
  private lastKeyTime = 0;
  
  public scannedBarcode = signal<string | null>(null);

  constructor() {
    this.listenToScanner();
  }

  private listenToScanner() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      const currentTime = new Date().getTime();
      
      // Filtro de latencia: el láser tipea casi instantáneo. > 50ms se asume humano.
      if (currentTime - this.lastKeyTime > 50) {
        this.barcodeBuffer = '';
      }

      this.lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (this.barcodeBuffer.length > 3) {
          this.scannedBarcode.set(this.barcodeBuffer);
          setTimeout(() => this.scannedBarcode.set(null), 100);
        }
        this.barcodeBuffer = '';
        return;
      }

      if (e.key.length === 1) {
        this.barcodeBuffer += e.key;
      }
    });
  }
}
