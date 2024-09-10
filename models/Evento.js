//Se desestructura mongoose y se extrae Schema y model
const {Schema, model} = require('mongoose'); //const mongoose = require('mongoose');

//Informacion del objeto Evento a guardar en la BD y crear la Coleccion con estos campos

//UsuarioSchema será un Schema
const EventoSchema = Schema({

    //Campo title
/*     title:{
        type: String, //tipo String
        required: true, //es requerido
    }, */

    affectedDepartment:{
        type: String, //tipo String
        required: true, //es requerido
    },

    //Nombre del ciberdelito
    cybercrimeType:{
        type: String, //tipo String
        required: true, //es requerido
    },

        //Campo start -FechaInicio Evento
    start: {
        type: Date,
        required: true,
    },

    //Campo descripcion del ciberdelito
    incidentDescription:{
        type: String, 
    },

    contactInfo:{
        type: String, //tipo String
        required: true, //es requerido
    },

    
    //Campo end -FechaFin Evento
 /*    end: {
        type: Date,
        required: true,
    },
 */

    //Definir al User que creo este Evento en el calendario
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //Referencia al Schema de Usuario - El user que escribio la nota
        required: true,
    }

});

//Sobreescribir como deseo que funcione el ToJSON - accede a las propiedades JSON que se guardan en la BD, es solo para ver la respuesta no modifica la DB
EventoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject(); //extrae los campos del JSON: __v, _id los demas estarán dentro de un Object
    object.id = _id;  //reemplazo _id a object.id.  antes: _id -> despues: id
    return object;
})

/*
Antes:
{
    "ok": true,
    "evento": {
        "title": "Cumpleaños del Jefe",
        "notes": "Comprar pastel",
        "start": "1970-01-01T00:00:00.001Z",
        "end": "1970-01-01T00:16:40.000Z",
        "_id": "6685910c33223359d826fa2e",
        "user": "6684c4dee7078a31bd73b6cf",
        "__v": 0
    }
}

despues:
{
    "ok": true,
    "evento": {
        "title": "Cumpleaños del Jefe",
        "notes": "Comprar pastel",
        "start": "1970-01-01T00:00:00.001Z",
        "end": "1970-01-01T00:16:40.000Z",
        "user": "6684c4dee7078a31bd73b6cf",
        "id": "6685945cb86bc302cf9986f6"
    }
}
*/

//Exportar
//Se creo un modelo llamado Evento, Mongoose asume que la coleccion a crear se llamará Eventos.
module.exports = model('Evento', EventoSchema);
