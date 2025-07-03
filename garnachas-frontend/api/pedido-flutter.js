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

      await client.query(
        "INSERT INTO pedidos (nombre, email, direccion, productos, total) VALUES ($1, $2, $3, $4, $5)",
        [
          pedido.nombre,
          pedido.email,
          JSON.stringify(pedido.direccion),
          JSON.stringify(pedido.productos),
          pedido.total
        ]
      );

      await client.end();

      //Enviar el correo a Brevo
      await fetch("https://api.brevo.com/v3/smtp/email", {
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
                <p> Dirección: ${pedido.direccion.calle}, ${pedido.direccion.cp}, ${pedido.direccion.ciudad},
                <p>Productos:</p>
                <ul>
                    ${pedido.productos.map((p) => `<li>${p.nombre} - Cantidad: ${p.cantidad} - Precio: $${p.precio}</li>`).join("")}
                </ul>
                <p>Total: $${pedido.total}</p>
                <p>¡Buen Provecho!</p>
                `
        })
      });

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      res.status(500).json({ error: "Error al procesar el pedido" });
    }
  }
  if (req.method === "GET") {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email es requerido" });

    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    try {
      await client.connect();

      const result = await client.query(
        "SELECT id, nombre, email, direccion, productos, total, fecha, datos_adicionales FROM pedidos WHERE email = $1 ORDER BY fecha DESC",
        [email]
      );
      await client.end();

      const pedidos = result.rows.map((row) => ({
        ...row,
        direccion:
          typeof rows.direccion === "string"
            ? JSON.parse(row.direccion)
            : rows.direccion,
        productos:
          typeof rows.productos === "string"
            ? JSON.parse(row.productos)
            : row.productos
      }));

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return res.status(500).json({ error: "Error al obtener los pedidos" });
    }

    return res.status(405).json({ error: "Método no permitido" });
  }
}
