const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res= response, next) => {

    //Como recibir el JWT- Token se recibe en el Headers: key(x-token) value(escribir el token generado por el login)
    const token = req.header('x-token');
    //console.log(token); //Se recibio el token

    //Validar si el token no viene - token es undefind, 
    if(!token){ //sig: !token es diferente del token, no es una cadena de texto
        return res.status(401).json({ //status 401 no autenticado
            ok:false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        //Validacion del token por medio del payload - uid del Usuario
        const {uid, name} = jwt.verify(  //se desetructura payload.  //const payload = jwt.verify(
            token, //token:token
            process.env.SECRET_JWT_SEED
        );
        //console.log(payload); //retorna el payload

        //Extraemos el uid del User que mando en la peticion(req) y lo establecemos al payload.uid del token
        req.uid = uid;  //usando uid desestructurado de payload   //req.uid = payload.uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        })
    }

    next();
}

//Exporta la func.
module.exports = {
    validarJWT
}