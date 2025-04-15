/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const stripe = require("stripe")("sk_test_51RDonfDuneb1ckN1u8Vu6hmQgHrNnwLZtib7Z97Muoi172NMluPX74aBs6idpLxuUaW0cuLC0vlJHwFMT7jm6S3V00Av5jw8fo");

exports.crearSesionPago = functions.https.onRequest(async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Garnacha Mexicana",
            },
            unit_amount: 5000, // $50.00 MXN
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://TU_PROYECTO.web.app/exito",
      cancel_url: "https://TU_PROYECTO.web.app/cancelado",
    });

    res.status(200).json({id: session.id});
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
