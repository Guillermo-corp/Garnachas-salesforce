import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password, client_id, redirect_uri, state } = req.body;

  if (!email || !password || !client_id || !redirect_uri || !state) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  if (client_id !== "123") {
    return res.status(401).json({ error: "Client ID inválido" });
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

    const userResult = await client.query(
      "SELECT id FROM usuarios WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (userResult.rows.length === 0) {
      await client.end();
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    const user_id = userResult.rows[0].id;

    const code = Math.random().toString(36).substring(2, 15);
    const expires_at = new Date(Date.now() + 10 * 60 * 3600);

    await client.query(
      "INSERT INTO oauth_codes (code, user_id, expires_at) VALUES ($1, $2, $3)",
      [code, user_id, expires_at]
    );
    await client.end();

    const redirectUrl = `${redirect_uri}?code=${code}&state=${state}`;
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (err) {
    console.error("Error en oauth-login:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
