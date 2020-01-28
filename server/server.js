require('./config/config');

const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/', function(req, res) {
    res.json('Hello World!');
});

app.get('/usuario', function(req, res) {
    res.json('GET World!');
});

app.post('/usuario', function(req, res) {
    let payload = req.body;

    if (payload.nombre === undefined) {
        res.status(400).json({
            message: "El nombre es obligatorio",
            OK: false,
            status: 400
        });
    } else {
        res.json({ body: payload });
    }
});

app.put('/usuario/:id', function(req, res) {
    let identificador = req.params.id;
    res.json({
        id: identificador
    });
});

app.delete('/usuario', function(req, res) {
    res.json('DELETE World!');
});

app.listen(process.env.PORT, () => {
    console.log('Example app listening on port', process.env.PORT);
});