require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

/* app.use((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.write('you posted:\n');
    res.end(JSON.stringify(req.body, null, 2));
}) */

app.get('/usuario', (req, resp) => {
    resp.send('getUsuario()');
});

app.post('/usuario', (req, resp) => {
    let body = req.body;
    if (body.nombre == undefined) {
        resp.status(400).json({
            ok: false,
            nombre: "El nombre es necesario"
        })
    } else {

        resp.send({
            persona: body
        });
    }
});

app.put('/usuario/:id', (req, resp) => {
    let id = req.params.id;

    resp.send({
        id
    });
});

app.delete('/usuario', (req, resp) => {
    resp.send('delete usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el pureto ${process.env.PORT}`);
});