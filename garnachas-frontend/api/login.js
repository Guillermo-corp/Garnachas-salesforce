import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
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
      "SELECT * FROM usuarios WHERE email = $1 AND password = $2",
      [email, password]
    );
    await client.end();

    if (result.rows.length === 1) {
      return res.status(200).json({ ok: true, user: { email } });
    } else {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
