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
import { CartService } from '../services/cart.service'; 
import { SalesforceService } from '../services/salesforce.service';
import { environment } from '../../environments/environments';

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
  cartItems: { name: string; quantity: number; price: number; image: string }[] = []; 
  duration = '2000';
  total: number = 0;

  constructor(private fb: FormBuilder, private cartService: CartService, private salesforceService: SalesforceService) {
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

    this.cartItems = this.cartService.getCartItems(); 
    this.getTotal(); 
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
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  
    const firstName = this.personalInfoForm.value.firstName || 'Cliente';
    const lastName = this.personalInfoForm.value.lastName || '';
    const customerName = `${firstName} ${lastName}`.trim();
  
    const uniqueName = `Compra ${formattedDate} - Cliente: ${customerName}`;
  
    const purchaseData = {
      Name: uniqueName, 
      Total__c: this.total,
      Items__c: JSON.stringify(this.cartItems), // Serializa los datos del carrito
      CustomerInfo__c: JSON.stringify(this.personalInfoForm.value), 
      Address__c: JSON.stringify(this.addressForm.value), 
      Name__c: customerName,
    };

    this.salesforceService.createPurchaseRecord(purchaseData).subscribe(
      (response) => {
        console.log('Compra registrada en Salesforce:', response);
        window.alert('Compra registrada exitosamente en Salesforce.');

   /*  window.alert('Pedido realizado con éxito!');
    console.log('Pedido realizado con éxito');
    console.log('Información Personal:', this.personalInfoForm.value);
    console.log('Dirección:', this.addressForm.value);
    console.log('Carrito:', this.cartItems);
    console.log('Total: $',this.total); */

    this.cartService.clearCart(); // Clear the cart
    this.cartItems = []; // Reset the cart items in the component
    this.total = 0; // Reset the total
  },
  (error) => {
    console.error('Error al registrar la compra en Salesforce:', error);
    window.alert('Hubo un error al registrar la compra en Salesforce.');
    }
  );
  }

  createCheckoutSession(): void {
    const cartItems = this.cartItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
  
    const salesforceUrl = `${environment.salesforce.baseUrl}/services/apexrest/StripeService`;
  
    this.salesforceService.createPurchaseRecord({ cartItems }).subscribe(
      (response) => {
        if (response.url) {
          window.location.href = response.url; // Redirige a Stripe Checkout
        } else {
          console.error('Error al crear la sesión de pago:', response);
        }
      },
      (error) => {
        console.error('Error al llamar a Salesforce:', error);
      }
    );
  }
}
