require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) {
            throw err;
        } else
            console.log("Base de datos UP!!");
    });

app.listen(process.env.PORT, () => {
    console.log('Example app listening on port', process.env.PORT);
});