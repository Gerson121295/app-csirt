
const path = require('path');

const express = require('express'); //import express from 'express';
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//console.log(process.env) //procesos corriendo en el envirement-variables de entorno
const querystring = require('querystring'); // Necesario para convertir el objeto a URL-encoded



//crear el servidor de express
const app = express();

//Funcion para la conexion a la Base de Datos
dbConnection();

//Configurar CORS: Para que el Frontend acceda al recurso API del backend
app.use(cors());

//use() en express es conocido como Un middleware que es una funcion que se 
//ejecuta cuando alguien hace una peticion al servidor.

//Directorio Publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json()); //recupera la data insertada del User en un Post


//Rutas
//El contenido del archivo(rutas:crear, login, renew) /routes/auth lo mostrará en la ruta: /api/auth - localhost:4000/api/auth
app.use('/api/auth', require('./routes/auth'));

//El contenido del archivo(rutas: CRUD-Eventos) /routes/events lo mostrará en la ruta: /api/auth - localhost:4000/api/events
app.use('/api/events', require('./routes/events'));



// Nueva ruta para obtener alertas de malware desde MalwareBazaar
app.get('/api/malware-alerts', async (req, res) => {
    try {
        const data = querystring.stringify({
            query: 'get_recent',
            selector: '100',
            api_key: process.env.MALWARE_BAZAAR_API_KEY,
            limit: 30
        });

        const response = await axios.post('https://mb-api.abuse.ch/api/v1/', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const filteredData = response.data.data.map(alert => ({
            file_name: alert.file_name,
            file_type: alert.file_type,
            reporter: alert.reporter,
            origin_country: alert.origin_country,
            signature: alert.signature,
            first_seen: alert.first_seen,
        }));

        res.json(filteredData.length > 0 ? filteredData : []); // Asegurar que siempre se devuelva un array
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos de la API de MalwareBazaar', details: error.message });
    }
});


//Nota: Debido a que se desplego el frontend en la carpeta public(asset, index.html) del backend
//cualquier peticion que no sean las rutas anterior: /api/auth', /api/events', redirija a servir el contenido de public/index.html
app.use('*', (req, res) => { //cualquier ruta no definida redirige a index.html
    res.sendFile(path.join( __dirname, 'public/index.html'));
});


//Escuchar peticiones
//Recibe el puerto en el cual se ejecutará, callback se ejecutará cuando el servidor express este arriba
app.listen(process.env.PORT, ()=> { 
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`); //4000
}); 
