const express = require('express');
const Stripe = require('stripe');
const app = express();
const stripe = Stripe('sk_test_51RDonoRhESm8WRh58OCjOg3QeGMWD6sEJc7Awvj755u1iHZO1NLQN7KxMeorCb6LwSBlCHCqoXMNEbshrBEfRnnn00ODdHyzqJ'); // Replace with your Stripe secret key
const cors = require('cors');
app.use(cors());
app.use(express.json());

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
        unit_amount: item.price * 100, // Convert to cents
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
    console.error('Error creating Stripe session:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));