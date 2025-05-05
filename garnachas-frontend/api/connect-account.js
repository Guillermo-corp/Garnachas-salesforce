const stripe = require('stripe')('sk_test_51RDonoRhESm8WRh58OCjOg3QeGMWD6sEJc7Awvj755u1iHZO1NLQN7KxMeorCb6LwSBlCHCqoXMNEbshrBEfRnnn00ODdHyzqJ'); // Reemplaza con tu clave secreta de Stripe

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const account = await stripe.accounts.create({
        type: 'express',
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://garnachas-mx.vercel.app/success', // Cambiar a una URL válida
        return_url: 'https://garnachas-mx.vercel.app/success',
        type: 'account_onboarding',
      });

      res.status(200).json({ url: accountLink.url });
    } catch (error) {
      console.error('Error al conectar la cuenta de Stripe:', error);
      res.status(500).json({ error: 'No se pudo conectar la cuenta de Stripe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}