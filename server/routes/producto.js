const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//============================================
// Crear un nuevo producto 
//============================================
app.post('/producto', verificaToken, (req, resp) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return resp.status(500).json({
                ok: true,
                err
            });
        }

        resp.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});

//============================================
// Actualizar un nuevo producto 
//============================================

app.put('/producto/:id', verificaToken, (req, resp) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productosDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        if (!productosDB) {
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productosDB.nombre = body.nombre;
        productosDB.precioUni = body.precioUni;
        productosDB.categoria = body.categoria;
        productosDB.disponible = body.disponible;
        productosDB.descripcion = body.descripcion;

        productosDB.save((err, productoSave) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err
                });
            }

            resp.json({
                ok: true,
                producto: productoSave
            });

        });
    });
});

//============================================
// Obtener  productos
//============================================

app.get('/productos', verificaToken, (req, resp) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err
                });
            }

            resp.json({
                ok: true,
                productos
            });
        });
});


//============================================
// Obtener  productos
//============================================
app.get('/producto/:id', (req, resp) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return resp.status(500).json({
                    ok: false,
                    err: {
                        message: 'EL ID no es correcto'
                    }
                })
            }

            resp.json({
                ok: true,
                producto: productoDB
            });


        });
});

//============================================
// Obtener  productos
//============================================
app.delete('/producto/:id', (req, resp) => {

    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return resp.status(500).json({
                ok: false,
                err: {
                    message: 'EL ID no es correcto'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoDelete) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err
                });
            }

            resp.json({
                ok: true,
                producto: productoDelete,
                message: 'Producto borrado'
            });
        });



    });
});


app.get('/producto/buscar/:termino', (req, resp) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err
                });
            }


            resp.json({
                ok: true,
                producto: productos
            });


        });
});


module.exports = app;