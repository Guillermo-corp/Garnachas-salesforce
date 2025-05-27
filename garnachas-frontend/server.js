const express = require('express');
const Stripe = require('stripe');
const axios = require('axios'); // Importa Axios para manejar solicitudes HTTP
const app = express();
const stripe = Stripe('sk_test_51RDonoRhESm8WRh58OCjOg3QeGMWD6sEJc7Awvj755u1iHZO1NLQN7KxMeorCb6LwSBlCHCqoXMNEbshrBEfRnnn00ODdHyzqJ'); // Reemplaza con tu clave secreta de Stripe
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/calculate-distance', async (req, res) => {
  const { origin, destination } = req.body;
  const apiKey = 'AIzaSyB1L5IGTTnITI4Sos95IqBdgOPhNImHTYE'; // Reemplaza con tu clave de API de Google

  console.log('Origin:', origin); 
  console.log('Destination:', destination);

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        key: apiKey,
      },
    });

    if (response.data.status === 'REQUEST_DENIED') {
      console.error('Error de Google API:', response.data.error_message);
      return res.status(400).json({ error: response.data.error_message });
    }

    console.log('Google API Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error al conectar con la API de Google:', error.message);
    res.status(500).send('Error al calcular la distancia');
  }
});

// Endpoint para Stripe (ya existente)
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cartItems } = req.body;

    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100, // Convertir a centavos
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:4200/stripesuccess',
      cancel_url: 'http://localhost:4200/stripecancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creando sesión de Stripe:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));