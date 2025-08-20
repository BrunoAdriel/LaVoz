import { getConnection } from "./bd.js";

export default async function handler(req, res) {
    try {
        const connection = await getConnection();

        const [participantes] = await connection.query('SELECT * FROM participantes');
        const [items] = await connection.query('SELECT * FROM items');
        const [carrier] = await connection.query('SELECT * FROM carrier');
        const [plataforma] = await connection.query('SELECT * FROM plataforma');
        const [idproducto] = await connection.query('SELECT idProducto FROM idproducto');

        await connection.end();

        res.status(200).json({
            status: true,
            result: {
                participantes,
                items,
                carrier,
                plataforma,
                idproducto: idproducto[0].idProducto
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la coneccion con Landing' });
    }
}