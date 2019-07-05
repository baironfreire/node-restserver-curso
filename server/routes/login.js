const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, resp) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDb
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        resp.json({
            ok: true,
            usuario: usuarioDb,
            token
        });

    })

});

module.exports = app;