import { Pool } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { uid, photo_url } = req.body;

  if (!uid || !photoUrl || !email) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await pool.query(
      'UPDATE user_profile_pics SET photo_url = $1 WHERE uid = $2',
      [photo_url, uid]
    );

    return res.status(200).json({ message: 'Imagen actualizada' });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    return res.status(500).json({ error: 'Error en la base de datos' });
  }
}
