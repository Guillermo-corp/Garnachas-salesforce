import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-pago',
  template: `<button (click)="iniciarPago()">Pagar con Stripe</button>`,
})
export class PagoComponent {
  constructor(private http: HttpClient) {}

  async iniciarPago() {
    const res: any = await this.http
      .post('https://us-central1-garnachas-backend.cloudfunctions.net/crearSesionPago', {})
      .toPromise();

    const stripe = await loadStripe(''); // 👈 Tu clave pública
    stripe?.redirectToCheckout({ sessionId: res.id });
  }
}

