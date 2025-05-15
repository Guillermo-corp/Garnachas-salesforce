const stripe = require('stripe')('sk_test_51RDonoRhESm8WRh58OCjOg3QeGMWD6sEJc7Awvj755u1iHZO1NLQN7KxMeorCb6LwSBlCHCqoXMNEbshrBEfRnnn00ODdHyzqJ'); // Reemplaza con tu clave secreta de Stripe

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { cartItems, connectedAccountId } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: 'mxn', // Cambia a pesos mexicanos
            product_data: {
              name: item.name,
              description: item.description,
              images: [item.image],
              metadata: {
                relleno: item.selectedRelleno || 'No especificado',
              },
            },
            unit_amount: Math.round(item.price * 100), // Stripe usa centavos
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: 'https://garnachas-mx.vercel.app/stripesuccess', // URL de éxito
        cancel_url: 'https://garnachas-mx.vercel.app/stripecancel', // URL de cancelación
        customer_creation: 'always',
        transfer_data: {
          destination: connectedAccountId, // Cuenta conectada de Stripe
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
      res.status(500).json({ error: 'No se pudo crear la sesión de pago' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}