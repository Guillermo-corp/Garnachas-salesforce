import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Ensure the service is provided in the root injector
})
export class CartService {
  private cartItems: any[] = [];

  addToCart(item: any): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity += 1; // Incrementar la cantidad si el producto ya está en el carrito
    } else {
      this.cartItems.push({ ...item, quantity: 1 }); // Agregar el producto con cantidad inicial de 1
    }
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
