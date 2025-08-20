import { getConnection } from "./bd";

export default async function handler(req, res) {
    try {
        const connection = await getConnection();

        const [participantes] = await connection.query('SELECT * FROM participantes');
        const [items] = await connection.query('SELECT * FROM items');
        const [carrier] = await connection.query('SELECT * FROM carrier');
        const [plataforma] = await connection.query('SELECT * FROM plataforma');
        const [idproducto] = await connection.query('SELECT idProducto FROM idproducto');

        connection.release();

        res.json({
            status: true,
            result: {
                participantes: participantes,
                items: items,
                carrier: carrier,
                plataforma: plataforma,
                idproducto: idproducto[0].idProducto
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la coneccion con Landing' });
    }
}