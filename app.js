const inicioDebug = require('debug')('app:inicio'); // Importar el paquerte debug
                                        // el paquete indica el archivo y el entorno
                                        // de depuración
const dbDebug = require('debug')('app:db');
const usuarios = require('./routes/usuarios');
const express = require('express'); // Importa el paquete express
const config = require('config'); // Requiere el paquete config
const logger = require('./logger');
const morgan = require('morgan'); 
// const { func, valid } = require('joi');
const Joi = require('joi');
const app = express(); // Crea una instancia de express

// Cuáles son los métodos a implementar con su ruta
// app.get();      // Consulta
// app.post();     // Envio de datos al servidor (insertar datos en la base)
// app.put();      // Actualización
// app.delete();   // Eliminación

app.use(express.json()); // Le decimos a express que use este 
                    // middleware

app.use(express.urlencoded({extended:true})); // Nuevo middleware
                            // Define el uso de la libreria qs
                            // para separar la informacion codificada 
                            // en url 

app.use(express.static('public')); // Nombre de la carpeta que tendra los archivos
                                // (recursos estáticos)

app.use('/api/usuarios', usuarios); // Middleware que importamos
// El primer parámetro es la ruta raíz asiciada 
// con la peticiones a los datos de usuarios
// La ruta raíz se va a concatenar como prefijo
// al inicio de todas las turas definidas en 
// el archivo usuarios.

console.log(`Aplicación: ${config.get('nombre')}`);
console.log(`DB server: ${config.get('configDB.host')}`);

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan Habilitado...');
    // Muestra el mensaje de depuración 
    inicioDebug('Morgan está habilitado'); 
}

dbDebug('Conectando con la base de datos...');

// app.use(logger); // logger ya hace referencia a la función log de logger.js
//                 // middleware

// app.use(function(req, res, next){
//     console.log('Autenticando...');
//     next(); // Le indicamos a express que llame la siguiente función middleware
//             // o la petición correspondiente
// });
 
// Los tres app.use() son middleware y se llaman antes 
// las funciones de ruta GET, POST, PUT, DELETE
// para que éstas puedan trabajar 


// Consulta en la ruta raíz del sitio
// Toda petición siempre va a recibir dos parámetros 
// req: la informaciónn que recibe el servidor desde el cliente
// res: la información que el servidor va a responder al cliente
// Vamos a utilizar el método send del objeto res
app.get('/', (req, res) => {
    res.send('Hola mundo desde Express');
});

app.get('/api/productos', (req, res) => {
    res.send(['mause', 'teclado', 'bocinas']);
});


// Recibiendo varios parámetros
// Se pasan dos parámetros year y month
// Query string
// localhost:5000/api/usuarios/1990/2/?nombre=xxxx&single=y
// app.get('/api/usuarios/:year/:month', (req, res) => {
//     // En el cuerpo de req está la propiedad 
//     // query, que guarda los parametros Query String
//     res.send(req.query);
// });

// El módulo process, contiene informacion del sistema 
// El objeto env contiene informacion de las variables 
// de entorno.
// fijo definido por nosotros (3000)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
}); 

// ----------- Funciones middleware --------------
// El middleware es un bloque de código que se se ejecuta 
// entre las peticiones del usuario (request) y la peticion 
// que llega al servidor. Es un enlace entre la petición 
// del usuario y el servidor, antes de que éste pueda dar
// una respuesta.

// Las funciones de middlerware son fuinciones que tienen accseso
// al objeto de solicitud (req), al objeto de respuesta (res)
// a la siguiente funcin de muddlewware en el ciclo de 
// solicitud/respuesta de la aplicacion. La siguiente 
// función de middleware se denota normalmente con una 
// variable denomina next.

// Las funciones de middleware pueden realizar las siguientes 
// tareas:

// -Ejecutar cualquier código
// -Realizar cambiar en la solicitud y los objetos de respuesta
// -Finalizar el ciclo de solicitud/respuestas
// -Invoca la siguiente funcion de middleware en la pila

// Express es una framework de direccionamineto y usu de middleware
// que permite que la aplicacion tenga funcionalida mínima propia

// Ya hemos utilizado algunos middleware como son express.json()
// que transforma el dody del req a formato json

//          ---------------------------
// request --|-->  json() --|--> route() --|--> response
//          ---------------------------

// route() --> Función GET, POST, PUT, DELETE

// Una aplicacion express puede utilizar los siguientes tipos
// de middleware
//      -Middleware de nivel de aplicaion
//      -Middleware de nivel de direccionador
//      -Middleware de manejo de errores
//      -Middleware de incorporador
//      -Middleware de terceros


// ----------- Recursos estáticos --------------
// Los recursos estáticos hacen referencia a archivos, 
// imágenes, docuentos que se ubican en el servidor.
// Vamos a usar middleware para acceder a estos recursos.   