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
  return res.status(405).json({ error: "Método no permitido" });
}
