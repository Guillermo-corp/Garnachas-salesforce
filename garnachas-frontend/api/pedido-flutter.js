import { Client } from 'pg';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error:'Método no permitido'});

    const pedido = req.body;

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();

        await client.query(
            'INSERT INTO pedidos (nombre, email, direccion, productos, total) VALUES ($1, $2, $3, $4, $5)',
            [
                pedido.nombre,
                pedido.email,
                JSON.stringify(pedido.direccion),
                JSON.stringify(pedido.productos),
                pedido.total
            ]
        ); 

        await client.end();

        //Enviar el correo a Brevo
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'Garnachas MX', email: '202160504@ucc.mx' },
                to: [{ email: pedido.email, name: pedido.nombre }],
                subject: "Confirmación de Pedido",
                htmlContent: `
                <h1>¡Gracias por tu pedido, ${pedido.nombre}!</h1>
                <p> Dirección: ${pedido.direccion.calle}, ${pedido.direccion.cp}, ${pedido.direccion.colonia}, ${pedido.direccion.ciudad},
                <p>Productos:</p>
                <ul>
                    ${pedido.productos.map(p => `<li>${p.nombre} - Cantidad: ${p.cantidad} - Precio: $${p.precio}</li>`).join('')}
                </ul>
                <p>Total: $${pedido.total}</p>
                <p>¡Buen Provecho!</p>
                `,
            }),
        });

        res.status(200).json({ ok: true});
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ error: 'Error al procesar el pedido' });
    }
}


