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

    // Verifica si el usuario ya existe
    const exists = await client.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    if (exists.rows.length > 0) {
      await client.end();
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Inserta el nuevo usuario
    await client.query(
      "INSERT INTO usuarios (email, password) VALUES ($1, $2)",
      [email, password]
    );
    await client.end();

    return res.status(201).json({ ok: true, message: "Usuario registrado" });
  } catch (err) {
    console.error("Error en registro:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
