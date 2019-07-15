const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


app.use(fileUpload()); //Cargamos la libreria 

app.put('/upload/:tipo/:id', (req, resp) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return resp.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // extenciones validas
    let extenciones = ['png', 'jpg', 'gif', 'jpeg'];
    if (extenciones.indexOf(extension) < 0) {
        return resp.status(400).json({
            ok: false,
            err: {

                message: 'Las extensiones permitidas son ' + extenciones.join(", "),
                ext: extension

            }
        });
    }

    //cambiar el nombre del archivo
    let nombreArchivo = `${id}.${extension}`;

    archivo.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios')
            imageUsuario(id, resp, nombreArchivo);
        else
            imgProducto(id, resp, nombreArchivo);


    });
});

let imageUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioSave) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioSave,
                img: nombreArchivo
            });


        });
    });
}

let imgProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }


        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoSave) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoSave,
                img: nombreArchivo
            });


        });
    });
}

let borrarArchivo = (nombreImagen, tipo) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;