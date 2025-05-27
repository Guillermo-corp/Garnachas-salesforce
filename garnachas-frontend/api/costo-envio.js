import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { origin, destination } = req.body;
  const apiKey = 'AIzaSyB1L5IGTTnITI4Sos95IqBdgOPhNImHTYE'; // Reemplaza con tu clave válida

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin y Destination son requeridos' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    https.get(url, (response) => {
      let data = '';

      // Recibe los datos en fragmentos
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Procesa la respuesta completa
      response.on('end', () => {
        const result = JSON.parse(data);

        if (result.status === 'REQUEST_DENIED') {
          return res.status(400).json({ error: result.error_message });
        }

        const distanceData = result.rows[0].elements[0];
        if (distanceData.status !== 'OK') {
          return res.status(400).json({ error: 'No se pudo calcular la distancia' });
        }

        const distanceInMeters = distanceData.distance.value;
        const durationInSeconds = distanceData.duration.value;

        res.status(200).json({
          distance: {
            text: distanceData.distance.text,
            value: distanceInMeters,
          },
          duration: {
            text: distanceData.duration.text,
            value: durationInSeconds,
          },
        });
      });
    }).on('error', (error) => {
      console.error('Error al conectar con la API de Google:', error.message);
      res.status(500).json({ error: 'Error al calcular la distancia' });
    });
  } catch (error) {
    console.error('Error interno:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}