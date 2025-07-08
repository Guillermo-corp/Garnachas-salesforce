import { Storage } from '@google-cloud/storage';
import formidable from 'formidable';
import { Pool } from 'pg';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GCLOUD_KEY || '{}'),
});
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error al procesar archivo' });

    const file = files.file;
    const uid = fields.uid;
    const email = fields.email;

    if (!file || !uid) {
      return res.status(400).json({ error: 'Falta archivo o UID' });
    }

    try {
      const blob = bucket.file(`profile_pics/${uid}.jpg`);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        console.error(err);
        return res.status(500).json({ error: 'Error al subir a Cloud Storage' });
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/profile_pics/${uid}.jpg`;

        try {
          // Guardar o actualizar en base de datos
          await pool.query(
            `INSERT INTO usuarios (uid, email, photo_url)
             VALUES ($1, $2, $3)
             ON CONFLICT (uid)
             DO UPDATE SET photo_url = EXCLUDED.photo_url, email = EXCLUDED.email`,
            [uid, email, publicUrl]
          );

          return res.status(200).json({ url: publicUrl });
        } catch (dbErr) {
          console.error('Error al guardar en la base de datos:', dbErr);
          return res.status(500).json({ error: 'Error en la base de datos' });
        }
      });

      fs.createReadStream(file.filepath).pipe(blobStream);
    } catch (error) {
      console.error('Error general:', error);
      return res.status(500).json({ error: 'Error inesperado' });
    }
  });
}