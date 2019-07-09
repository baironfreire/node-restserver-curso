const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google

async function verify(token) {
    const tikect = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = tikect.getPayload();
    console.log('info', payload);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }

}

app.post('/google', async(req, resp) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(
        (error) => {
            return resp.status(403).json({
                ok: false,
                err: error
            });
        }
    );

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google == false) {
                return resp.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return resp.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return resp.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    })


});

module.exports = app;