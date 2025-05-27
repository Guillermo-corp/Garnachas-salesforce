import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { origin, destination } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY; // Asegúrate de configurar esta variable en Vercel
  
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin y Destination son requeridos' });
  }

  try {
    // Llamada a la API de Google Distance Matrix
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        key: apiKey,
      },
    });

    if (response.data.status === 'REQUEST_DENIED') {
      return res.status(400).json({ error: response.data.error_message });
    }

    const distanceData = response.data.rows[0].elements[0];
    if (distanceData.status !== 'OK') {
      return res.status(400).json({ error: 'No se pudo calcular la distancia' });
    }

    // Extraer distancia y duración
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
  } catch (error) {
    console.error('Error al conectar con la API de Google:', error.message);
    res.status(500).json({ error: 'Error al calcular la distancia' });
  }
}