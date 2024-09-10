const { response } = require("express")
const Evento = require("../models/Evento")

// Event Routes - localhost:4000/api/events


//Obtener eventos
const getEventos = async(req, res = response) => {

    //El modelo Eventos cuenta con funciones como find el cual obtiene todos los eventos
    const eventos = await Evento.find() //dentro del find({}) se podrian aplicar filtros de busqueda
                                //populate rellena datos del campo(user), muestra el obj user con sus campos, o solo, mostrar el name o 'name password'
                                .populate('user','name'); 

    //Respuesta a mostrar al User
    res.json({
        ok: true,
        eventos //eventos:eventos //muestra los Eventos todos los eventos guardardos en el Calendar
        //msg: 'getEventos'
    })
}


//Crear un nuevo evento
const crearEvento = async(req, res= response) => {

    //verificar que tengo el evento
    //console.log(req.body);   
    
    //Crear el evento -> Instanciar el Model Evento() y enviarle el cuerpo de la peticion del User como parametro
    const evento = new Evento(req.body);

    try {

        //Obtenemos el id del User que escribio la nota y se le asigna al evento.user
        evento.user = req.uid; //Se asigna el uid del user al evento.user(model) = por medio de: req.uid(el uid de la peticion)

        //Guarda el evento en MongoDB
        const eventoGuardado = await evento.save();

        //Muestra al usuario la respuesta
        res.json({
            ok:true,
            evento: eventoGuardado //muestra el evento que se guardo en la DB
        })

    } catch (error) { //retorna el error si existierá
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Hable con el admnistrador'
        });
    }
}

//Actualizar evento
const actualizarEvento = async(req, res= response) => {

    //obtener id del evento que viene en la url 
    const eventoId = req.params.id;
    //obtener id del usuario que viene en la peticion
    const uid = req.uid;

    try {
        //Busca el evento por medio de su id 
        const evento = await Evento.findById(eventoId);

        //valida si el id recibido es valido
        if(!evento) { // si es diferente de evento
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        //Verifica si la persona que creo este evento, es la que lo quiere modificar, solo si la persona es dueñas de su evento la podrá modificar
        if( evento.user.toString() !== uid ){//si el user del evento es diferente del uid del usuario recibido de la peticion
            return res.status(401).json({ //401 no autorizado
                ok:false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }  
        
        //Es la persona que creo el evento por lo que podra editarlo
        //Data del nuevo Evento a actualizar
        const nuevoEvento = {
            ...req.body, //desestructurar todo lo que manden en la peticion
            user: uid  //el envio el uid del usuario al evento
        }

        //actualiza evento con la nueva data
        //const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento); //Actualiza pero retorna el evento anterior 
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true}); //con {new: true} -Actualiza y retorna el evento actualizado
        
        //Mostrar respuesta al usuario
        res.json({
            ok:true,
            evento: eventoActualizado  //se muestra los datos del nuevo evento actualizado
        });

    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok:false,
            msg:'Hable con el admin'
        });
    }

}

//Borrar evento
const eliminarEvento = async(req, res= response) => {

     //obtener id del evento que viene en la url
     const eventoId = req.params.id;
     //obtener id del usuario que viene en la peticion
    const uid = req.uid;


    let evento; //codePropose

     try {
         //Busca el evento por medio de su id 
         //const evento = await Evento.findById(eventoId); //codeProf

        //CodePropose TRY-CATCH-Resuelve error si id de evento no se encruentra en la DB
      try{
            evento = await Evento.findById(eventoId);
          } catch (err) {
            // If theres an error it means that the id is not valid
            evento = null;
          }

         //valida si el id recibido es valido
         if(!evento) { // si es diferente de evento
             return res.status(404).json({
                 ok: false,
                 msg: 'Evento no existe con ese id'
             });
         }
 
         //Verifica si la persona que creo este evento, es la que lo quiere modificar, solo si la persona es dueñas de su evento la podrá modificar
         if( evento.user.toString() !== uid ){//si el user del evento es diferente del uid del usuario recibido de la peticion
             return res.status(401).json({ //401 no autorizado
                 ok:false,
                 msg: 'No tiene privilegio de eliminar este evento'
             });
         }  
 
        //Elimina el evento por medio de su id
        await Evento.findByIdAndDelete( eventoId ); 

         //Mostrar respuesta al usuario
         res.json({
             ok:true
         });
 
     } catch (error) {
         console.log(error),
         res.status(500).json({
             ok:false,
             msg:'Hable con el admin'
         });
     }

}

//exporta las funciones
module.exports = {
    getEventos,
    actualizarEvento,
    crearEvento,
    eliminarEvento
}