import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Ensure the service is provided in the root injector
})
export class CartService {
  private cartItems: any[] = [];

  addToCart(item: any): void {
    this.cartItems.push(item);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
