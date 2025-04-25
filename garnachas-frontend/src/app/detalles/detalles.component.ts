import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service'; // Correct the import


@Component({
  selector: 'app-detalles',
  imports: [CommonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent {

  personalInfoForm: FormGroup;
  addressForm: FormGroup;
  cartItems: { name: string; quantity: number; price: number; image: string }[] = []; // Include 'image'
  duration = '2000';
  total: number = 0;

  constructor(private fb: FormBuilder, private cartService: CartService) {
    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
    });

    this.cartItems = this.cartService.getCartItems(); // Obtener productos del carrito
    this.getTotal(); // Calcular el total al inicializar el componente
  }

  getTotal(): void {
    console.log('Cart Items:', this.cartItems);
    this.total =  this.cartItems.reduce((total, item) => {
      /* console.log('Processing item:', item); */
      const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
      const price = Number.isFinite(item.price) ? item.price : 0;
      return total + quantity * price;
    }, 0);
  }

  placeOrder(): void {
    window.alert('Pedido realizado con éxito!');
    console.log('Pedido realizado con éxito');
    console.log('Información Personal:', this.personalInfoForm.value);
    console.log('Dirección:', this.addressForm.value);
    console.log('Carrito:', this.cartItems);
    console.log('Total: $',this.total);

    this.cartService.clearCart(); // Clear the cart
    this.cartItems = []; // Reset the cart items in the component
    this.total = 0; // Reset the total
  }
}
