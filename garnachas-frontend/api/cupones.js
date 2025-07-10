import { Client } from "pg";

export default async function handler(req, res) {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    try {
      await client.connect();

      const pedidosRes = await client.query(
        "SELECT COUNT(*) FROM pedidos WHERE email = $1",
        [email]
      );
      const totalPedidos = parseInt(pedidosRes.rows[0].count, 10);

      if (totalPedidos >= 5) {
        const cuponRes = await client.query(
          "SELECT * FROM cupones WHERE email = $1 AND usado = false",
          [email]
        );

        if (cuponRes.rows.length === 0) {
          const codigo = `FIDE-${Date.now()}`;
          const descuento = 0.10;

          await client.query(
            "INSERT INTO cupones (email, codigo, descuento) VALUES ($1, $2, $3)",
            [email, codigo, descuento]
          );
        }
      }

      await client.end();
      return res.status(200).json({ ok: true, totalPedidos });
    } catch (err) {
      console.error("Error al manejar cupones:", err);
      return res.status(500).json({ error: "Error al generar cupón" });
    }
  }

  if (req.method === "GET") {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    try {
      await client.connect();
      const result = await client.query(
        "SELECT * FROM cupones WHERE email = $1 AND usado = false",
        [email]
      );
      await client.end();

      return res.status(200).json({ cupones: result.rows });
    } catch (err) {
      console.error("Error al obtener cupones:", err);
      return res.status(500).json({ error: "Error al obtener cupones" });
    }
  }

  if (req.method === "PATCH") {
    const { email, codigo } = req.body;
    if (!email || !codigo)
      return res.status(400).json({ error: "Email y código requeridos" });

    try {
      await client.connect();

      const result = await client.query(
        "SELECT * FROM cupones WHERE email = $1 AND codigo = $2 AND usado = false",
        [email, codigo]
      );

      await client.end();

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Cupón inválido o ya fue usado" });
      }

      const cupon = result.rows[0];
      return res.status(200).json({
        ok: true,
        codigo: cupon.codigo,
        descuento: cupon.descuento,
      });
    } catch (err) {
      console.error("Error al aplicar cupón:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }
  }

  if (req.method === "PUT") {
    const { email, codigo } = req.body;
    if (!email || !codigo)
      return res.status(400).json({ error: "Email y código requeridos" });

    try {
      await client.connect();

      const update = await client.query(
        "UPDATE cupones SET usado = true WHERE email = $1 AND codigo = $2 AND usado = false",
        [email, codigo]
      );

      await client.end();

      if (update.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Cupón no encontrado o ya usado" });
      }

      return res
        .status(200)
        .json({ ok: true, message: "Cupón marcado como usado" });
    } catch (err) {
      console.error("Error al usar cupón:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
