import { Pool } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { uid, email, photo_url } = req.body;

  if (!uid || !photo_url) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    await pool.query(
      `INSERT INTO user_profile_pics (uid, email, photo_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (uid) DO UPDATE SET
         email = EXCLUDED.email,
         photo_url = EXCLUDED.photo_url`,
      [uid, email, photo_url]
    );

    return res.status(200).json({ message: "Imagen actualizada" });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    return res.status(500).json({ error: "Error en la base de datos" });
  }
}
