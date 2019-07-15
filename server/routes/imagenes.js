const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();


app.get('/imagen/:tipo/:img', verificaToken, (req, resp) => {
    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        resp.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        resp.sendFile(noImagePath);
    }

});

module.exports = app;