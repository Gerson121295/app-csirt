
const jwt = require('jsonwebtoken');

//func. generarJWT recibe lo que se necesita colocar como PAYLOAD en el TOKEN ->uid, name
const generarJWT = (uid, name) => {

    //Proceso de generacion de JWT si sale bien resuelve con resolve el token, si da un error reject 
    return new Promise((resolve, reject) => {
        const payload = { uid, name };

        //generar el token: recibe: payload, SECRET_KEY y la expiracion del token
        jwt.sign(
            payload,  //recibe payload: uid, name
            process.env.SECRET_JWT_SEED, //el secret SECRET_JWT_SEED (palabra unica creada en .env) valida si es el tokem que genere o no
            {
                expiresIn: '2h' //fecha de expiracion del token
            }, (err, token) => { //callback se dispara un error si no se pudiera firmar y el token
                
                //si existe un error ejecuta el reject
                if(err){
                    console.log(err)
                    reject('No se pudo generar el TOKEN');
                }
                //Si se genera correctamente el token se resuelve con el resolve
                resolve(token);
            }
        );

    }) 


}

module.exports = {
    generarJWT
}

