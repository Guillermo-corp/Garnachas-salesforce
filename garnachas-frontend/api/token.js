import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { code, client_id, client_secret } = req.body;

  if (client_id !== "123" || client_secret !== "garnachas") {
    return res.status(401).json({ error: "Credenciales inválidas" });
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

    const result = await client.query(
      "SELECT user_id, expires_at FROM oauth_codes WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      await client.end();
      return res.status(400).json({ error: "Código inválido" });
    }

    const { user_id, expires_at } = result.rows[0];
    if (expires_at && new Date() > expires_at) {
      await client.end();
      return res.status(400).json({ error: "Código expirado" });
    }

    await client.query("DELETE FROM oauth_codes WHERE code = $1", [code]);

    const access_token = Math.random().toString(36).substring(2, 15);

    await client.end();

    return res.status(200).json({
      access_token,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: "refresh-" + access_token
    });
  } catch (err) {
    console.error("Error en token:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
