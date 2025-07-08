import { Storage } from '@google-cloud/storage';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: { bodyParser: false }
};

const credentials = JSON.parse(process.env.GCLOUD_KEY);
const storage = new Storage({ credentials });
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error al procesar archivo' });

    const file = files.file;
    const uid = fields.uid;

    if (!file || !uid) {
      return res.status(400).json({ error: 'Falta archivo o UID' });
    }

    const blob = bucket.file(`profile_pics/${uid}.jpg`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', () => {
      return res.status(500).json({ error: 'Error al subir a Cloud Storage' });
    });

    blobStream.on('finish', async () => {
      await blob.makePublic(); 
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/profile_pics/${uid}.jpg`;
      res.status(200).json({ url: publicUrl });
    });

    fs.createReadStream(file.filepath).pipe(blobStream);
  });
}