const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, resp) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return resp.status(400).json({
                    ok: false,
                    error: err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                resp.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });


});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, resp) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                error: err
            });
        }

        resp.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, resp) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                error: err
            });
        }

        resp.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, resp) => {
    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {

            resp.status(400).json({
                ok: false,
                error: err
            });
        }

        if (!usuarioDB) {

            resp.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        resp.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;