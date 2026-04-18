import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5001/api';

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getProduct(barcode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${barcode}`);
  }

  addProduct(product: { barcode: string; name: string; price: number; stock?: number; expiration?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: string, product: { barcode: string; name: string; price: number; stock: number; expiration?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }

  checkout(sale: { items: any[], total: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales`, sale);
  }
  
  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sales`);
  }
}
