// functions/index.js
const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_tu_clave_secreta');

exports.crearSesionPago = functions.https.onRequest(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'mxn',
        product_data: {
          name: 'Tacos de Canasta',
        },
        unit_amount: 6000, // $60.00 MXN
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://tusitio.web.app/exito',
    cancel_url: 'https://tusitio.web.app/cancelado',
  });

  res.json({ id: session.id });
});
