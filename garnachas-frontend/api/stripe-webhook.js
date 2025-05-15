import Stripe from 'stripe';
import * as Brevo from '@sendinblue/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Necesario para validar firmas de Stripe
  },
};

const getRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Método no permitido');
  }

  const sig = req.headers['stripe-signature'];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // 1. Recuperar los detalles de la compra
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    const items = lineItems.data.map((item) => {
        return {
          name: item.name,
          relleno: item.description,
          quantity: item.quantity,
          price: (item.amount_total / 100).toFixed(2),
        };});

    // 2. Configurar Brevo
    const brevoClient = new Brevo.TransactionalEmailsApi();
    brevoClient.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    // 3. Enviar correo de confirmación
    try {
      await brevoClient.sendTransacEmail({
        to: [{ email: session.customer_details.email, name: session.customer_details.name }],
        sender: { email: '202160504@ucc.mx', name: 'Garnachas MX' },
        subject: 'Gracias por tu compra 🍽️',
        htmlContent: `
          <h1>¡Gracias por tu pedido, ${session.customer_details.name}!</h1>
          <p>Tu compra fue confirmada. Aquí están los detalles:</p>
          <ul>
            ${items
              .map(
                (item) =>
                  `<li>${item.quantity} × ${item.name} de ${ item.relleno } — $${item.price} MXN</li>`
              )
              .join('')}
          </ul>
          <p>Total: $${(session.amount_total / 100).toFixed(2)} MXN</p>
          <p>Nos vemos pronto. ¡Buen provecho!</p>
        `,
      });

      console.log('✅ Correo enviado con Brevo');
    } catch (emailError) {
      console.error('❌ Error enviando email con Brevo:', emailError);
    }
  }

  res.status(200).json({ received: true });
}
