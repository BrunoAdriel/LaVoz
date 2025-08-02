const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/packs', (req, res) => {
    const data ={
        pack : [
            {ITEM : "50 Preguntas", ID_ITEM : 1, DESCRIPCION :"50", ITEM_PRICE : 50, ITEM_CANT : 50},
            {ITEM : "100 Preguntas", ID_ITEM : 2, DESCRIPCION :"100", ITEM_PRICE : 100, ITEM_CANT : 100},
            {ITEM : "150 Preguntas", ID_ITEM : 3, DESCRIPCION :"150", ITEM_PRICE : 150, ITEM_CANT : 150},
            {ITEM : "200 Preguntas", ID_ITEM : 4, DESCRIPCION :"200", ITEM_PRICE : 200, ITEM_CANT : 200},
        ]
    };
    res.json(data);
})

app.post('/packs', (req, res) => {
    const { id_plataforma, id_trivia, id_item, item_cant, item_price, ani, email, id_carrier, id_producto } = req.body;

    if (!id_plataforma || !id_trivia || !id_item || !item_cant || !item_price || !id_carrier || !id_producto || !ani || !email) {
        return res.json({ status: false, error: "Faltan datos obligatorios" });
    }

    res.json({
        status: true,
        result: {
            init_point: "/packs",
            checkout_url: "/packs"
        }
    });
});




app.get('/landing', (req, res) => {
const dataRecived = {
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
    res.json(dataRecived);
})

app.listen(port, () => {
    console.log(`API corriendo http://localhost:${port}`);
});