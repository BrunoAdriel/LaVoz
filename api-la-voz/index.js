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

/*     const dataRecived = {
    participantes : [
        {name : "Agustina", team : "Lali", idParticipante : 1, img : "img/agustina.jpg", teamImg : "img/logovozarg.png"},
        {name : "Florencio", team : "Luck Ra", idParticipante : 2, img : "img/florencio.jpg", teamImg : "img/logovozarg.png"},
        {name : "Laura", team : "Miranda", idParticipante : 3, img : "img/laura.jpg", teamImg : "img/logovozarg.png"},
        {name : "Santi", team : "Soledad", idParticipante : 4, img : "img/santi.jpg", teamImg : "img/logovozarg.png"},
        {name : "Benja", team : "Lali", idParticipante : 5, img : "img/benja.jpg", teamImg : "img/logovozarg.png"},
        {name : "Valen", team : "Luck Ra", idParticipante : 6, img : "img/valen.jpg", teamImg : "img/logovozarg.png"},
        {name : "Mariale", team : "Miranda", idParticipante : 7, img : "img/mariale.jpg", teamImg : "img/logovozarg.png"},
    ],
    items : [
        { item_cant : 50, item_price : "10.00"},
        { item_cant : 100, item_price : "20.00"}
    ],
    carrier : [
        {name : "claro", id : 1},
        {name : "personal", id : 2},
        {name : "movistar", id : 3},
    ],
    plataforma : [
        {name : "Mercado Pago", id : 1},
        {name : "Pago360", id : 2},
        {name : "Mensaje de Texto", id : 3}
    ],
    idproducto: 355
};
    res.json(dataRecived); */
})


app.get/('/preguntas', (req, res) => {
    const result = {
        PREGUNTA: [
            { ID_PREGUNTA: 1, PREGUNTA: "¿Cuál es la capital de Francia?"},
            RESPUESTAS = [
                { A: 1, RESPUESTA: "París" },
                { B: 2, RESPUESTA: "Londres" }
            ]
        ],
        PUNTOS :"498",
        RESTANTES : 10,
        TOTAL: 101
    }
        res.json(result);
    })


app.listen(3000, () => {
    console.log("Servidor backend corriendo en http://localhost:3000");
});