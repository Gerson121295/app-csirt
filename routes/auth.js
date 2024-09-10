
// Rutas de Usuarios /Auth:  host + /api/auth  ->POST: localhost:4000/api/auth/new

//Forma 1 de importar Router de express
//const express = require('express');
//const router = express.Router

//Forma 2 de importar Router de express
const { Router } = require('express');
const { check } = require('express-validator'); 
const router = Router();

const { validarCampos } = require('../middlewares/validar-campos');

//se desetrutura para obtener funciones del archivo de la ruta: '../controllers/auth');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt')

//Crear Usuario ->POST: localhost:4000/api/auth/new  -> { "name":"Paula", "email": "paula@gmail.com", "password":"123456" }
router.post(
    '/new', 
    [//midleware: es una funcion que se va a ejecutar antes de otra.
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser >= 6 caracteres ').isLength({min:6}),
        validarCampos, 
    ],
    crearUsuario,
);

//loginUsuario ->POST: localhost:4000/api/auth/  -> { "email": "paula@gmail.com", "password":"123456" }
router.post(
    '/',
     [//midleware: es una funcion que se va a ejecutar antes de otra.
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser >= 6 caracteres ').isLength({min:6}),
        validarCampos,
    ],
     loginUsuario
);

//revalidarToken-Renovar Token 2hrs mientras User este activo 
//->GET: localhost:4000/api/auth/renew  Token se recibe en el Headers, en key y value escribir lo que esta dentro de parentesis: key(x-token) value(ABC123)
//hacer el login en Postman copiar el TOken y pegarlo en el value de key x-token

router.get(
    '/renew',
    validarJWT, //se define 1 solo middleware -validar JWT
    revalidarToken
);


//Exportar 
module.exports = router;