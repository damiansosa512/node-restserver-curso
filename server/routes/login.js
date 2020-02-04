const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    let payload = req.body;
    Usuario.findOne({ email: payload.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario incorrecto'
                }
            })
        }
        if (!bcrypt.compareSync(payload.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Contraseña incorrecta'
                }
            })
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        })
    })

});

module.exports = app;