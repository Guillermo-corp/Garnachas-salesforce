import { Client } from "pg";

function normalizarEmail(texto) {
  return texto
    .replace(/\s?arroba\s?/gi, "@")
    .replace(/\s?punto\s?/gi, ".")
    .replace(/\s?guion\s?bajo\s?/gi, "_")
    .replace(/\s?guion\s?/gi, "-")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    let { email, nombre } = req.query;
    if (!email && !nombre) {
      return res.status(400).json({ error: "Email o nombre son requeridos" });
    }
    if (email) {
      email = normalizarEmail(email);
    }

    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    try {
      await client.connect();

      let result;
      if (email) {
        result = await client.query(
          "SELECT id, nombre, email, direccion, productos, total, fecha FROM pedidos WHERE email = $1 ORDER BY fecha DESC",
          [email]
        );
      } else {
        result = await client.query(
          "SELECT id, nombre, email, direccion, productos, total, fecha FROM pedidos WHERE nombre = $1 ORDER BY fecha DESC",
          [nombre]
        );
      }
      await client.end();

      const pedidos = result.rows.map((row) => ({
        ...row,
        direccion:
          typeof row.direccion === "string"
            ? JSON.parse(row.direccion)
            : row.direccion,
        productos:
          typeof row.productos === "string"
            ? JSON.parse(row.productos)
            : row.productos
      }));

      res.status(200).json(pedidos);
      return;
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return res.status(500).json({ error: "Error al obtener los pedidos" });
    }
  }
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
            <p>Dirección: ${pedido.direccion.calle}, ${pedido.direccion.cp}, ${pedido.direccion.ciudad}</p>
            <p>Productos:</p>
            <ul>
              ${pedido.productos
                .map(
                  (p) =>
                    `<li>${p.nombre} - Cantidad: ${p.cantidad} - Precio: $${p.precio}</li>`
                )
                .join("")}
            </ul>
            <p>Total: $${pedido.total}</p>
            <p>¡Buen provecho!</p>
          `
        })
      });

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      return res.status(500).json({ error: "Error al procesar el pedido" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
