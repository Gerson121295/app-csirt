
const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect( //se agrega await porque todo esto devuelve una promesa
            process.env.DB_CNN, //variable de entorno(.env) contiene el string de conexion 
           /* { //esto No se necesita
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            } */ 
        );

        //Si la conexion a la DB fue exitosa
        console.log('DB Online');


    } catch (error) { //si da error la conexion a la DB
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }
}

//export se utiliza en el index.js
module.exports = {
    dbConnection
}