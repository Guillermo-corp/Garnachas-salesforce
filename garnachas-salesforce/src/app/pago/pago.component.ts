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

    const stripe = await loadStripe('pk_test_51RDonfDuneb1ckN1mjIju8Y9HTTYGTcuirT9Eqbn2cPeFuvrGH0baG9cbhKGm0Y2XRX9tOdbHymoHZe1QttgeNra00pz8lizQJ'); // 👈 Tu clave pública
    stripe?.redirectToCheckout({ sessionId: res.id });
  }
}

