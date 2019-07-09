require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse aplication/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion de rutas
app.use(require('./routes/index'));

/* app.use((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.write('you posted:\n');
    res.end(JSON.stringify(req.body, null, 2));
}) */



mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el pureto ${process.env.PORT}`);
});