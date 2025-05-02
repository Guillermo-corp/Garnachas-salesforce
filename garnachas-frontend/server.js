const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY'); // Reemplaza con tu clave secreta de Stripe

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;

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
          },
          unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'https://garnachas-mx.vercel.app/success', // URL de éxito
      cancel_url: 'https://garnachas-mx.vercel.app/cancel', // URL de cancelación
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    res.status(500).json({ error: 'No se pudo crear la sesión de pago' });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));