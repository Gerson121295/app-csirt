
//const express = require('express');
const { response } = require('express'); //se desestructura response de express
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

//controller de las rutas, son funciones definidas en /routes/auth.js


//const crearUsuario = (req, res = express.response) => { //agregar = express.response ayuda a recordar los valores para desarrollo rapido
const crearUsuario = async(req, res = response) => { //se desestructura response de express para solo usar response

    //console.log(req.body); //recupera la peticion del User su data insertada
    //se desestructura req.body para extraer data especifica que el usuario dio en el request
    const { email, password } = req.body;  //name ->no
    
    try {
    
    //Validacion si ya existe el Usuario por medio del email. Modelo usuario cuenta con funciones para hacer busquedas en la BD
    //verifica el email con el email que viene del request.body ({email:email})
    //si usuario retorna un null, no existe nadie en la BD con ese correo, si retorna 1 objeto entonces existe  un Usuario con ese correo
    let usuario = await Usuario.findOne({email}); 
    //console.log(usuario); 

    if(usuario){
        return res.status(400).json({
            ok:false,
            msg: 'Un usuario existe con ese correo.'
        });
    }

    //Instancia del Usuario - para crear usuarios, se le envia req(peticion con datos definidos por el User)
    usuario = new Usuario(req.body); //usuario le cae a la instancia anterior reemplando los datos de la validacion previa
  
    //Encriptar el password del Usuario antes de enviar a la BD - Usando Encriptacion de una sola Via
    //Para encriptar se necesita un salt - genSaltSync por defecto usa 10 numero de vueltas para encriptar la password, podemos aumentarla
    const salt = bcrypt.genSaltSync(); 

    //Se encripta el password del usuario, bcrypt.hashSync recibe: password y salt
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar el usuario en la DB
    await usuario.save();

    //Generar el token JWT luego de crear el Usuario, ya que se mandará en la respuesta para autenticarse
    //Func generarJWT recibe el payload(uid, name) para agregarlo al token
    const token = await generarJWT(usuario.id, usuario.name);


    //Si el nombre tiene mas de 4 caracteres - status 200 Ok
    res.status(201).json({
            ok:true,
            //msg: 'registro',
            //user: req.body //retorna en la respuesta toda la data insertada del User en el Request
            //name, email, password  //retorna el name del user escrito en el request
            uid: usuario.id,
            name: usuario.name,
            token //token: token   //muestra el token 
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async(req, res= response) => {

    //se desestructura req.body para extraer data especifica que el usuario dio en el request
    const { email, password } = req.body; 

    try {
        //Confirmar si existe un usuario con el email del req.body con los email de la BD.
        //verifica el email de BD con el email que viene del request.body ({email:email})
        //si usuario retorna un null, no existe nadie en la BD con ese correo, si retorna 1 objeto entonces existe un Usuario con ese correo
        const usuario = await Usuario.findOne({email}); 
        //console.log(usuario); 

        //si usuario no existe(usuario=null) o Usuario es diferente de Usuario(obj) retorna el error 400 
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese correo.'
            });
        }

        //Si el usuario existe hace el login

        //Confirma los password: 
        //valida el password(de req.body la peticion) con el password almacenado en la BD, retorna true(si es valido), false(si no)
        const validPassword = bcrypt.compareSync(password, usuario.password)

        //Si validPassword no es valido(es false)
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto.'
            });
        }

        //Si las contraseñas hacen match - Generamos nuestro JWT
        //Generar el token JWT luego de hacer el Login, ya que se mandará en la respuesta para autenticarse
        //Func generarJWT recibe el payload(uid, name) para agregarlo al token
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token //token:token  //manda la respuesta del token -token generado
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }
}


const revalidarToken = async(req, res= response) => {

    const { uid, name } = req; //obtiene el uid y name enviado en la peticion req por el User
 
    //Generar un nuevo JWT y lo retornar en la respuesta -recibe el payload(uid, name) para agregarlo al token
    const token = await generarJWT(uid, name);

    //retorna la respuesta al usuario
    res.json({
        ok: true,
        token, //retorna el nuevo token generado
        uid, //uid:uid  /enviamos la uid del User en la respuesta
        name,
        //msg: 'renew'
    })
}


//exportar las funciones
module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}

