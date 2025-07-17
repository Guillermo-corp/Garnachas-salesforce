import { Component, AfterViewInit, NgZone } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../services/cart.service';
import { SalesforceService } from '../services/salesforce.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogPaymentComponent } from '../dialog-payment/dialog-payment.component';

declare const google: any;

@Component({
  selector: 'app-detalles',
  imports: [
    CommonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements AfterViewInit {
  personalInfoForm: FormGroup;
  addressForm: FormGroup;
  map: any;
  marker: any;
  cartItems: {
    name: string;
    quantity: number;
    price: number;
    image: string;
    selectedRelleno?: string;
    relleno?: string;
  }[] = [];
  duration = '2000';
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private salesforceService: SalesforceService,
    private http: HttpClient,
    private ngZone: NgZone,
    private dialog: MatDialog
  ) {
    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required]
    });

    this.cartItems = this.cartService.getCartItems();
    this.getTotal();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.openPaymentDialog();
    /* this.initializeAutocomplete();  */
  }

  //Autocomplete para el campo de dirección sin el mapa.
  /* initializeAutocomplete(): void { 
    
    const autocompleteInput = document.getElementById('autocomplete') as HTMLInputElement;

    if (!autocompleteInput) {
      console.error('El elemento con ID "autocomplete" no se encontró en el DOM.');
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
      types: ['address'], // Solo direcciones
      componentRestrictions: { country: 'mx' }, // Restringir a México (opcional)
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.address_components) {
        const addressComponents = place.address_components; 

        // Extraer los datos de la dirección
        const street = this.getAddressComponent(addressComponents, 'route');
        const city = this.getAddressComponent(addressComponents, 'locality');
        const zipCode = this.getAddressComponent(addressComponents, 'postal_code');

        // Actualizar el formulario con los datos extraídos
        this.ngZone.run(() => {
          this.addressForm.patchValue({
            street: street || '',
            city: city || '',
            zipCode: zipCode || '',
          });
        });
        
      }
    });
  } */

  initializeMap(): void {
    const mapElement = document.getElementById('map') as HTMLElement;
    const searchBoxInput = document.getElementById(
      'map-search-box'
    ) as HTMLInputElement;

    this.map = new google.maps.Map(mapElement, {
      center: { lat: 19.18095, lng: -96.1429 }, // Coordenadas iniciales (Ciudad de México)
      zoom: 14
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true
    });

    // Inicializar el SearchBox
    const searchBox = new google.maps.places.SearchBox(searchBoxInput);

    // Vincular el SearchBox al mapa
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      searchBoxInput
    );

    // Evento para manejar la selección de una ubicación en el SearchBox
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Centrar el mapa en la primera ubicación seleccionada
      const place = places[0];
      if (place.geometry && place.geometry.location) {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15); // Ajustar el zoom
        this.marker.setPosition(place.geometry.location);

        // Obtener la dirección de la ubicación seleccionada
        this.getAddressFromCoordinates(
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
      }
    });

    // Evento para manejar clics en el mapa
    this.map.addListener('click', (event: any) => {
      const clickedLocation = event.latLng;
      this.marker.setPosition(clickedLocation);
      this.getAddressFromCoordinates(
        clickedLocation.lat(),
        clickedLocation.lng()
      );
    });

    // Evento para manejar el movimiento del marcador
    this.marker.addListener('dragend', (event: any) => {
      const draggedLocation = event.latLng;
      this.getAddressFromCoordinates(
        draggedLocation.lat(),
        draggedLocation.lng()
      );
    });
  }

  getAddressFromCoordinates(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    const latLng = { lat, lng };

    geocoder.geocode({ location: latLng }, (results: any, status: string) => {
      if (status === 'OK' && results.length > 0) {
        const place = results[0];
        const addressComponents = place.address_components;

        // Extraer los datos de la dirección
        const streetNumber = this.getAddressComponent(
          addressComponents,
          'street_number'
        );
        const street = this.getAddressComponent(addressComponents, 'route');
        const city = this.getAddressComponent(addressComponents, 'locality');
        const zipCode = this.getAddressComponent(
          addressComponents,
          'postal_code'
        );

        const fullStreet = `${street || ''} ${streetNumber || ''}`.trim();

        // Actualizar el formulario con los datos extraídos
        this.ngZone.run(() => {
          this.addressForm.patchValue({
            street: fullStreet || '',
            city: city || '',
            zipCode: zipCode || ''
          });
        });

        console.log('Dirección obtenida del mapa:', place.formatted_address);
      } else {
        console.error(
          'No se pudo obtener la dirección a partir de las coordenadas:',
          status
        );
      }
    });
  }
  getAddressComponent(components: any[], type: string): string | undefined {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : undefined;
  }

  openPaymentDialog(): void {
    const dialogRef = this.dialog.open(DialogPaymentComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'cash') {
        console.log('Pago con efectivo seleccionado');
      } else if (result === 'card') {
        this.payWithStripe();
      }
    });
  }

  getNextCompraId(): number {
    const lastId = Number(localStorage.getItem('lastCompraId')) || 0; // Obtiene el último ID o 0 si no existe
    const nextId = lastId + 1; // Incrementa el ID
    localStorage.setItem('lastCompraId', nextId.toString()); // Guarda el nuevo ID en localStorage
    return nextId;
  }

  getTotal(): void {
    console.log('Cart Items:', this.cartItems);
    this.total = this.cartItems.reduce((total, item) => {
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
      Email__c: this.personalInfoForm.value.email
    };

    this.salesforceService.createCliente(clienteData).subscribe(
      (clienteResponse) => {
        console.log('Cliente creado:', clienteResponse);

        const direccionData = {
          Calle__c: this.addressForm.value.street,
          Ciudad__c: this.addressForm.value.city,
          CP__c: this.addressForm.value.zipCode,
          Cliente__c: clienteResponse.id
        };

        this.salesforceService.createDireccion(direccionData).subscribe(
          (direccionResponse) => {
            console.log('Direccion creada:', direccionResponse);

            const compraData = {
              cliente__c: clienteResponse.id,
              Name: `${this.getNextCompraId()} - Compra`,
              Fecha_Compra__c: new Date().toISOString(),
              Metodo_pago__c: 'Efectivo',
              Total__c: this.total
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
                    Compra__c: compraResponse.id
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
                this.shippingCost = 0; // Reiniciar el costo de envío
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
    /* const backendUrl = 'http://localhost:3000/create-checkout-session';   */
    const backendUrl =
      'https://garnachas-mx.vercel.app/api/create-checkout-session';

    const stripeCartItems = this.cartItems.map((item) => ({
      name: item.name,
      description: `Relleno: ${item.selectedRelleno || 'No especificado'}`,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    stripeCartItems.push({
      name: 'Costo de envío',
      description: 'Costo calculado por distancia',
      price: this.shippingCost,
      quantity: 1,
      image:
        'https://media.istockphoto.com/id/1186665850/es/vector/cami%C3%B3n-de-entrega-de-env%C3%ADo-r%C3%A1pido-dise%C3%B1o-de-icono-de-l%C3%ADnea-ilustraci%C3%B3n-vectorial-para.jpg?s=612x612&w=0&k=20&c=4IODuEWsnMLEgriQF7rOu3mN3CXtXVmQPVgJngit0jE='
    });

    this.http
      .post<{ url: string }>(backendUrl, { cartItems: stripeCartItems })
      .subscribe({
        next: (response) => {
          if (response.url) {
            window.location.href = response.url; // Redirect to Stripe Checkout
          } else {
            console.error('No URL returned from Stripe session creation');
            window.alert(
              'Error al generar la sesión de pago. Intenta nuevamente.'
            );
          }
        },
        error: (err) => {
          console.error('Error al conectar con el servidor:', err);
          window.alert(
            'Hubo un problema al conectar con el servidor. Intenta nuevamente.'
          );
        }
      });
  }

 
  shippingCost: number = 0; 
  subtotal: number = 0; 

  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((total, item) => {
      const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
      const price = Number.isFinite(item.price) ? item.price : 0;
      return total + quantity * price;
    }, 0);
    console.log('Subtotal calculado:', this.subtotal);
  }
  // Método para calcular el costo de envío
  calculateShippingCost(): void {
    this.calculateSubtotal();

    const destination = this.addressForm.value;
    const destinationAddress = `${destination.street}, ${destination.city}, ${destination.zipCode}`;

    /* const origin = '19.18095,-96.1429'; */
    const origin = 'Francisco Canal 1597, Veracruz, 91700';

    console.log('Destination Address:', destinationAddress);
    console.log('Origin:', origin);

    /*   const backendUrl = 'http://localhost:3000/calculate-distance'; // URL del backend
     */
    const backendUrl = 'https://garnachas-mx.vercel.app/api/costo-envio'; 
    this.http
      .post<any>(backendUrl, { origin, destination: destinationAddress })
      .subscribe({
        next: (response) => {
          console.log('Distance Matrix API Response:', response); 
          if (response.distance && response.duration) {
            const distanceInMeters = response.distance.value; 
            const distanceInKm = distanceInMeters / 1000;
            this.shippingCost = Math.round(distanceInKm * 2);
            this.total = this.subtotal + this.shippingCost;

            console.log('Distancia:', distanceInKm.toFixed(2), 'km');
            console.log('Costo de envío:', this.shippingCost, 'MXN');
          } else {
            console.error(
              'Error al calcular la distancia:',
              response.rows[0].elements[0].status
            );
          }
        },
        error: (err) => {
          console.error('Error al conectar con el backend:', err);
        }
      });
  }

  sendOrderToBackend(): void {
  const cliente = {
    Name: this.personalInfoForm.value.firstName,
    Apellido__c: this.personalInfoForm.value.lastName,
    Email__c: this.personalInfoForm.value.email,
  };

  const direccion = {
    Calle__c: this.addressForm.value.street,
    Ciudad__c: this.addressForm.value.city,
    CP__c: this.addressForm.value.zipCode,
  };

  const direccionStr = `${direccion.Calle__c}, ${direccion.Ciudad__c}, CP: ${direccion.CP__c}`;

  const platillos = this.cartItems.map((item) => ({
    Name: item.name,
    Cantidad__c: item.quantity,
  }));

  const productosStr = platillos
    .map((p) => `${p.Name} x${p.Cantidad__c}`)
    .join(', ');

  const payload = {
    nombre: `${cliente.Name} ${cliente.Apellido__c}`,
    email: cliente.Email__c,
    direccion: direccionStr,
    productos: productosStr,
    total: this.total,
    fecha: new Date().toISOString(),
  };

  const backendUrl = 'https://garnachas-mx.vercel.app/api/pedido-angular';

  this.http.post(backendUrl, payload).subscribe({
    next: () => {
      window.alert('¡Pedido enviado exitosamente al backend!');
      this.cartService.clearCart();
      this.cartItems = [];
      this.total = 0;
      this.shippingCost = 0;
    },
    error: (err) => {
      console.error('Error al enviar pedido:', err);
      window.alert('Error al enviar el pedido al backend.');
    }
  });
}

}
