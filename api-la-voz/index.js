const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');


const app = express();
app.use(cors());
app.use(express.json());

// Coneccion a la SQL

const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:'RocioBel43093',
    database:  'laVoz',
    waitForConnections: true,
});


// Data de Packs

app.get('/packs', async ( req, res )=>{
    try{
        const connection = await pool.getConnection();
        
        // Obtengo toda la informacion que necesito para packs
        const [pack] = await connection.query('SELECT * FROM pack');
        const [carrier] = await connection.query('SELECT * FROM carrier');
        const [plataforma] = await connection.query('SELECT * FROM plataforma');
        const [id_producto] = await connection.query('SELECT id_producto FROM id_producto');
        const [id_trivia] = await connection.query('SELECT id_trivia FROM id_trivia');
        connection.release(); 

        res.json({
            status: true,
            result:{
                pack: pack,
                carrier: carrier,
                plataforma: plataforma,
                id_producto: id_producto[0].id_producto,
                id_trivia: id_trivia[0].id_trivia
            }
        });

    }catch(error){
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la coneccion de Packs' })
    }
})
// Post de Packs
app.post('/packs', (req, res) => {
    const { id_plataforma, id_trivia, id_item, item_cant, item_price, ani, email, id_carrier, id_producto } = req.body;

    if (!id_plataforma || !id_trivia || !id_item || !item_cant || !item_price || !id_carrier || !id_producto || !ani || !email) {
        return res.json({ status: false, error: "Faltan datos obligatorios" });
    }

    res.json({
        status: true,
        result: {
            init_point: "",
            checkout_url: ""
        }
    });
});


// Data de Landing


app.get('/landing', async (req, res) => {
    try{
        const connection = await pool.getConnection();

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
    }catch(error){
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la coneccion con Landing'});
    }
})

// Post de Landing
app.post('/landing', (req, res) => {
    const { id_candidato, id_plataforma, item_cant, item_price, ani, email, id_carrier, id_producto } = req.body;

    if (!id_candidato || !id_plataforma || !item_cant || !item_price || !ani || !email || !id_carrier || !id_producto) {
        return res.json({ status: false, error: "Faltan datos obligatorios" });
    }

    res.json({
        status: true,
        result: {
            init_point: "",
            checkout_url: ""
        }
    });
});


// Data de Preguntas


app.get/('/preguntas/:ani', async (req, res) => {
    const { ani } = req.params; 
    try{

    }catch(error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la coneccion con Preguntas' });
    }
})


app.listen(3000, () => {
    console.log("Servidor backend corriendo en http://localhost:3000");
});