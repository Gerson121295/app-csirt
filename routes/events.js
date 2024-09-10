const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');


const router = Router();
// Event Routes - localhost:4000/api/events
//Postman: POST, PUT, GET, DELETE: necesitan en el header el token: (key agregar: x-token) y en (values: pegar token generado del login)

//Todas las rutas abajo de este use tienen que pasar por el middleware "validarJWT" Validar Token -Para evitar escribir validarJWT en cada ruta
router.use(validarJWT);


//Obtener eventos  GET: localhost:4000/api/events  Header: key=x-token values=AGREGAR TOKEN GENERADO DE LOGIN
router.get(
    '/',
    //validarJWT, //F1:Definir middleware para una ruta. F2: con router.use valida validarJWT a todas las rutas
    getEventos
);

//Crear un nuevo evento -> POST: localhost:4000/api/events  -> {"title":"Cumpleaños del Jefe", "start":1, "end":1000000, "notes":"Comprar pastel"}
router.post(
    '/',
    [ //midleware para validar los campos del Evento
        //check('title', 'El titulo es obligatorio').not().isEmpty(), //campo title no debe ser vacio
        //check('start', 'Fecha de inicio es obligatoria').custom(isDate), //valida la fecha con isDate validacion personalizada
        //check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        
        check('affectedDepartment', 'Departamento afectado es obligatorio').not().isEmpty(),
        check('cybercrimeType', 'El tipo de ciberdelito es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate), //valida la fecha con isDate validacion personalizada
        check('contactInfo', 'Informacion de contacto es obligatorio').not().isEmpty(),
        
        validarCampos, //midleware valida campos si no cumple con los check anteriores muestra error no ejecuta el siguiente crearEvento.
    ],
    //validarJWT, //middleware
    crearEvento
);

//Actualizar evento -> PUT: localhost:4000/api/events/id_evento    {"title":"Cumpleaños del Jefe", "start":1, "end":1000000, "notes":"Comprar bebidas y cariños"}
router.put(
    '/:id',
    actualizarEvento
);

//Borrar evento -> DELETE: localhost:4000/api/events/id_evento  
router.delete(
    '/:id',
    eliminarEvento
);

//Exportar 
module.exports = router;