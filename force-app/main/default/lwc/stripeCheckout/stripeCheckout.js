import { LightningElement, api } from 'lwc';
import createCheckoutSession from '@salesforce/apex/StripeService.createCheckoutSession';

export default class StripeCheckout extends LightningElement {
    @api cartItems = [];

    async handleCheckout() {
        try {
            const sessionUrl = await createCheckoutSession({ cartItems: this.cartItems });
            window.location.href = sessionUrl; // Redirige a Stripe Checkout
        } catch (error) {
            console.error('Error al iniciar el pago:', error);
        }
    }
}