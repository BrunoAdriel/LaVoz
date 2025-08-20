import mysql from 'mysql2/promise';

export default async function getLanding(req, res) {
    try {

    const connection = await mysql.createConnection(process.env.DATABASE_URL);
        
        const [participantes] = await connection.execute('SELECT * FROM participantes');
        
        await connection.end();

        res.status(200).json({participantes});

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la coneccion de Packs' });
    }
}