const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                error: 'Token no valido'
            });
        } else {
            req.usuario = decoded.usuario;
            next();
        }
    });

};

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario.role);
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}