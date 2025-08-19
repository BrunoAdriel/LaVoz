const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path'); 

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
// Coneccion a la SQL

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
});

// Servir el frontend estático
app.use(express.static(path.join(__dirname, 'fontend')));

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
// Validar ANI

app.get('/preguntas/validar/:ani', async (req, res) => {
    const { ani } = req.params; 
    try{
        const connection =await pool.getConnection();
        const [rows] = await connection.query('SELECT ani, puntos, total, restantes FROM usuarios WHERE ani = ?', [ani]);
        connection.release();

        if(!rows.length){
            return res.json({ status: false, error: 'Usuario no registrado' });
        }

        const usuario = rows[0];
        res.json({
            status: true,
            ani: usuario.ani,
            puntos: usuario.puntos,
            total: usuario.total,
            restantes: usuario.restantes,
            triviaActiva: usuario.restantes > 0 
        });
    }catch(error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la coneccion con Preguntas' });
    }
})

//Obtener la siguiente pregunta
app.post('/preguntas/siguiente', async (req, res) => {
    const { ani, id_trivia } = req.body;

    try{
        const connection = await pool.getConnection();
        const [resultPreg] = await connection.query('CALL obtener_pregunta(?, ?)', [ani,id_trivia]);
        connection.release();

        // Si no hay mas preguntas disponibles
        const preguntaData = resultPreg[0][0];
        if(!preguntaData || !preguntaData.id_pregunta){
            return res.json({
                status: false,
                mensaje: "Trivia Finalizada",
                puntosFinales: preguntaData?.puntos || 0,
                restantes: preguntaData?.restantes || 0 
            });
        }

        res.json({
            status: true,
            result: {
                PREGUNTA: {
                    ID_TRIVIA: preguntaData.id_trivia,
                    ID_PREGUNTA: preguntaData.id_pregunta,
                    PREGUNTA: preguntaData.pregunta,
                    RESPUESTAS: preguntaData.respuestas
                },
                PUNTOS: preguntaData.puntos,
                RESTANTES: preguntaData.restantes,
                TOTAL: preguntaData.total,
                CROSSELING:{
                    mensaje: "❌ Te estás quedando sin preguntas!",
                    link: "/packs"
                }
            }
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al obtener la pregunta disponible' });
    }
})

//Enviar la respuesta
app.post('/preguntas/responder', async (req, res) => {
    const {ani, id_pregunta, clave, id_trivia} = req.body;

    try{
        const connection = await pool.getConnection();
        await connection.query('CALL responder_pregunta(?, ?, ?)', [ani, id_pregunta, clave]);

        const [proximaPregunta] = await connection.query('CALL obtener_pregunta(?,?)', [ani, id_trivia]);
        connection.release();

        res.json({ status: true, mensaje: "Respuesta registrada", result: proximaPregunta[0][0] || null });

    }catch(error){
        if (error.code === 'ER_DUP_ENTRY') {
            return res.json({ status: false, error: "Pregunta ya respondida" });
        }
        console.error(error);
        res.status(500).json({ status: false, error: 'Error al enviar respuesta al servidor'})
    }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));