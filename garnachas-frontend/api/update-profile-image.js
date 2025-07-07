import { Client } from "pg";
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { uid, email, photoUrl } = req.body;

        if (!uid || !photoUrl) {
            return res.status(400).json({ error: 'El uid y la URL de la foto son requeridos' });
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

            // Aqui inserta o actualiza la imagen de perfil en la base de datos
            await client.query(
                'INSERT INTO user_profile_pics (uid, email, photo_url) VALUES ($1, $2, $3) ON CONFLICT (uid) DO UPDATE SET photo_url = EXCLUDED.photo_url, email = EXCLUDED.email',
                [uid, email, photoUrl]
            );
            await client.end();

            res.status(200).json({ ok: true });
        } catch (error) {
            console.error('Error al actualizar la imagen de perfil:', error);
            res.status(500).json({ error: 'Error al actualizar la imagen de perfil' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}