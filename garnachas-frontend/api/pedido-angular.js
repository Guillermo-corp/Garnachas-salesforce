import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const pedido = req.body;

    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    try {
      await client.connect();

      // Insertar en PostgreSQL
      await client.query(
        "INSERT INTO pedidos (nombre, email, direccion, productos, total, fecha) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          pedido.nombre,
          pedido.email,
          JSON.stringify({ direccion: pedido.direccion }),
          JSON.stringify({ productos: pedido.productos }),
          pedido.total,
          pedido.fecha
        ]
      );

      await client.end();

      // Enviar correo con Brevo
      const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "Garnachas MX", email: "202160504@ucc.mx" },
          to: [{ email: pedido.email, name: pedido.nombre }],
          subject: "Confirmación de Pedido",
          htmlContent: `
            <h1>¡Gracias por tu pedido, ${pedido.nombre}!</h1>
            <p><strong>Dirección:</strong> ${pedido.direccion}</p>
            <p><strong>Productos:</strong> ${pedido.productos.map((p) => p.nombre).join(", ")}</p>
            <p><strong>Total:</strong> $${pedido.total}</p>
            <p>¡Buen provecho!</p>
          `
        })
      });

      const brevoData = await brevoResponse.json();
      console.log("Brevo status:", brevoResponse.status);
      console.log("Brevo response:", brevoData);

      if (!brevoResponse.ok) {
        throw new Error(`Error al enviar correo: ${JSON.stringify(brevoData)}`);
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      res
        .status(500)
        .json({ error: error.message || "Error al procesar el pedido" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
