import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Ensure the service is provided in the root injector
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private router: Router) {}

  addToCart(item: any): void {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity += 1; // Incrementar la cantidad si el producto ya está en el carrito
    } else {
      currentItems.push({ ...item, quantity: 1 }); // Agregar el producto con cantidad inicial de 1
    }
    this.cartItems.next(currentItems); // Emitir cambios
  }

  getCartItems(): any[] {
    return this.cartItems.getValue();
  }

  clearCart(): void {
    this.cartItems.next([]); // Emitir cambios
  }

  removeItemFromCart(item: any): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.map(cartItem => {
      if (cartItem.name === item.name) {
        // Decrement quantity if IDs match
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      }
      return cartItem; // Keep other items unchanged
    }).filter(cartItem => cartItem.quantity > 0); // Remove items with quantity <= 0

    this.cartItems.next(updatedItems); // Emit updated cart items
  }

  navigateToDetailsWithCart(): void {
    // Asegúrate de que los datos del carrito estén actualizados
    this.cartItems.next(this.cartItems.getValue());
    // Navega al componente de detalles
    this.router.navigate(['/detalles']);
  }
}
