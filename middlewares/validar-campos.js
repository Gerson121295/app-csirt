const { response } = require('express');
const { validationResult } = require('express-validator'); //se desestructura y se obtiene el resultado de la validacion


//midleware: es una funcion que se va a ejecutar antes de otra.


// Contiene todos los datos que se han ejecutado antes(peticion, respuesta, next(se llama si el middleware se ejecuta correctamente))
const validarCampos = (req, res = response, next) => { //next ejecuta cada middleware, 

    //Manejo de errores - Validar error con Express Validator
    const errors = validationResult( req );

    if( !errors.isEmpty() ){  //errors es diferente de vacio, si hay error, hace un return
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    //Si no hay ningun error llama al next();
    next();
}

module.exports = {
    validarCampos
}

