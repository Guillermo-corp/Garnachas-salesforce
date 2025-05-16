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
import { HttpClient } from '@angular/common/http';

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
  cartItems: { 
    name: string; 
    quantity: number; 
    price: number; 
    image: string; 
    selectedRelleno?: string; 
    relleno?: string; // Add the 'relleno' property explicitly
  }[] = []; 
  duration = '2000';
  total: number = 0;

  constructor(private fb: FormBuilder, private cartService: CartService, private salesforceService: SalesforceService, private http: HttpClient) {
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
    const clienteData = {
      Name: this.personalInfoForm.value.firstName,
      Apellido__c: this.personalInfoForm.value.lastName,
      Email__c: this.personalInfoForm.value.email,
    };

    this.salesforceService.createCliente(clienteData).subscribe(
      (clienteResponse) => {
        console.log('Cliente creado:', clienteResponse);
      
        
        const direccionData = {
          Calle__c: this.addressForm.value.street,
          Ciudad__c: this.addressForm.value.city,
          CP__c: this.addressForm.value.zipCode,
          Cliente__c: clienteResponse.id, // Asociar la dirección al cliente
        };

        this.salesforceService.createDireccion(direccionData).subscribe(
          (direccionResponse) => {
            console.log('Direccion creada:', direccionResponse);

            const compraData = {
              cliente__c: clienteResponse.id, // ID del cliente creado
              Name: `Compra - ${new Date().toLocaleDateString()}`,
              Fecha_Compra__c: new Date().toISOString(),
              Metodo_pago__c: 'Efectivo', // Cambiar según sea necesario
              Total__c: this.total,
            };

            this.salesforceService.createCompra(compraData).subscribe(
              (compraResponse) => {
                console.log('Compra creada:', compraResponse);

                this.cartItems.forEach((item) => {
                  const platilloData = {
                    Name: item.name,
                    Precio__c: item.price,
                    Relleno__c: item.selectedRelleno || 'Sin especificar',
                    Imagen_url__c: item.image,
                    Cantidad__c: item.quantity,
                    Compra__c: compraResponse.id, // Asociar el platillo a la compra
                  };

                  this.salesforceService.createPlatillo(platilloData).subscribe(
                    (platilloResponse) => {
                      console.log('Platillo creado:', platilloResponse);
                    },
                    (error) => {
                      console.error('Error al crear Platillo__c:', error);
                    }
                  );
                });

                window.alert('Pedido registrado exitosamente en Salesforce.');
                this.cartService.clearCart();
                this.cartItems = [];
                this.total = 0;
              },
              (error) => {
                console.error('Error al crear Compra__c:', error);
                window.alert('Hubo un error al registrar la compra.');
              }
            );
          },
          (error) => {
            console.error('Error al crear Direccion__c:', error);
            window.alert('Hubo un error al registrar la dirección.');
          }
        );
      },
      (error) => {
        console.error('Error al crear Cliente__c:', error);
        window.alert('Hubo un error al registrar el cliente.');
      }
    );
  }

  payWithStripe(): void {
    /* const backendUrl = 'http://localhost:3000/create-checkout-session'; // Replace with your backend URL */
    const backendUrl = 'https://garnachas-mx.vercel.app/api/create-checkout-session';


    const stripeCartItems = this.cartItems.map((item) => ({
      name: item.name,
      description: `Relleno: ${item.selectedRelleno || 'No especificado'}`, // Agregar el relleno a la descripción
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    this.http.post<{ url: string }>(backendUrl, { cartItems: stripeCartItems }).subscribe({
      next: (response) => {
        if (response.url) {
          window.location.href = response.url; // Redirect to Stripe Checkout
        } else {
          console.error('No URL returned from Stripe session creation');
          window.alert('Error al generar la sesión de pago. Intenta nuevamente.');
        }
      },
      error: (err) => {
        console.error('Error al conectar con el servidor:', err);
        window.alert('Hubo un problema al conectar con el servidor. Intenta nuevamente.');
      },
    });
  }

 /*  connectStripeAccount() {
    this.http.post<{ url: string }>('/connect-account', {}).subscribe({
      next: (response) => {
        console.log('Respuesta de connect-account:', response); // <-- Agrega este log
        window.location.href = response.url; // Redirigir al enlace de conexión de Stripe
      },
      error: (err) => {
        console.error('Error al conectar cuenta de Stripe:', err); // <-- Log del error recibido
      },
    });
  }
  createCheckoutSession(): void {
    const cartItems = this.cartItems.map((item) => ({
      name: item.name,
      description: item.name, // Puedes usar una descripción más detallada si está disponible
      price: item.price,
      quantity: item.quantity,
      image: item.image, // Asegúrate de que el objeto tenga la propiedad `image`
    }));

    console.log('Datos enviados a createCheckoutSession:', cartItems); // <-- Agrega este log
  
    
    this.salesforceService.createCheckoutSession(cartItems).subscribe(
      (data) => {
        if (data.url) {
          console.log('URL de Stripe:', data.url); // Verifica que la URL se imprima correctamente
          window.location.href = data.url; // Redirige a Stripe Checkout
        } else {
          console.error('Error: No se recibió una URL de Stripe.', data);
          window.alert('Hubo un problema al generar la sesión de pago. Intenta nuevamente.');
        }
      },
      (error) => {
        console.error('Error al crear la sesión de Stripe:', error);
        window.alert('Hubo un problema al conectar con el servidor. Intenta nuevamente.');
      }
    );
  } */
}
