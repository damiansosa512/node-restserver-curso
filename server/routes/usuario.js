const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const _ = require('underscore');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.get('/', function(req, res) {
    res.json('Hello World!');
});

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                })
            } else {
                Usuario.count({ estado: true }, (err, contador) => {
                    res.status(200).json({
                        ok: true,
                        cantidad: contador,
                        usuarios: usuarios
                    })
                })
            }
        })
});

app.post('/usuario', function(req, res) {
    let payload = req.body;
    let usuario = new Usuario({
        nombre: payload.nombre,
        email: payload.email,
        password: bcrypt.hashSync(payload.password, 10),
        role: payload.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        } else
            usuarioDB.password = null;
        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', function(req, res) {
    let identificador = req.params.id;
    let payload = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(identificador, payload, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.status(200).json({
                ok: true,
                usuario: usuarioDB
            });
        }
    })

});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {    
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        } else {
            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        }
    })

});

module.exports = app;