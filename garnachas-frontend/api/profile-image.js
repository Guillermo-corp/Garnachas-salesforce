import { Client } from "pg";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { uid } = req.query;
        
        if (!uid) return res.status(400).json({ error: 'El uid es requerido' });

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
                'SELECT photo_url FROM user_profile_pics WHEERE uid = $1',
                [uid]
            );
            await client.end();

            res.status(200).json({
                 photoUrl: result.rows[0]?.photo_url ?? null});
        } catch (error) {
            console.error('Error al obtener la imagen de perfil:', error);
            res.status(500).json({ error: 'Error al obtener la imagen de perfil'
            });
        }
    }else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
    