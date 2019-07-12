const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();


/*====================================================
Registrar las categorias 
======================================================*/
app.post('/categoria', verificaToken, (req, resp) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        resp.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/*====================================================
Mostrar todas las categorias 
======================================================*/
app.put('/categoria/:id', (req, resp) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return resp.status(500).json({
                ok: true,
                categoria: categoriaDB
            });
        }

        if (!categoriaDB) {
            return resp.status(400).json({
                ok: false,
                err
            });
        }

        resp.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/*====================================================
Eliminar una categoria
======================================================*/
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, resp) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        resp.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});

/*====================================================
Consulta una categoria
======================================================*/

app.get('/categoria/:id', verificaToken, (req, resp) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {

            resp.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return resp.status(500).json({
                ok: false,
                err: {
                    message: 'EL ID no es correcto'
                }
            })
        }

        resp.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/*====================================================
Consulta todas categorias
======================================================*/

app.get('/categorias', verificaToken, (req, resp) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre')
        .exec((err, categorias) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err
                });
            }

            resp.json({
                ok: true,
                categorias
            });
        });
});
module.exports = app;