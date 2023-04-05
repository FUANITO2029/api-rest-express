const inicioDebug = require('debug')('app:inicio'); // Importar el paquerte debug
                                        // el paquete indica el archivo y el entorno
                                        // de depuración
const dbDebug = require('debug')('app:db');

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

const usuarios = [
    {id:1, nombre:'juan'},
    {id:2, nombre:'Karen'},
    {id:3, nombre:'Diego'},
    {id:4, nombre:'Maria'}
];

function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)));
}
function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string()
                .min(3)
                .required()
    })
    return schema.validate({nombre:nom});
};


// Consulta en la ruta raíz del sitio
// Toda petición siempre va a recibir dos parámetros 
// req: la informaciónn que recibe el servidor desde el cliente
// res: la información que el servidor va a responder al cliente
// Vamos a utilizar el método send del objeto res
app.get('/', (req, res) => {
    res.send('Hola mundo desde Express');
});

app.get('/api/usuarios', (req, res) =>{
    res.send(usuarios);
});

// Recibe como párametro el id del usaurio 
// que se va a eliminar
app.delete('/api/usuarios/:id', (req, res) =>{
    const usuario = existeUsuario(req.params.id)
    if(!usuario){
        res.status(404).send('El usuario no se encuentra');//Deveulve el estado HTTP
        return;
    } 

    // Encontrar el ídice del usaurio dentro del arreglo
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);// Elimina el usuario en el índice
    res.send(usuario); // Se responde con el usuario eliminado
    return;
});


app.get('/api/productos', (req, res) => {
    res.send(['mause', 'teclado', 'bocinas']);
});

// Con los : delante del id
// Express sabe que es un parámetro a recibir en la ruta
app.get('/api/usuarios/:id', (req, res) => {
    // // En el cuerpo del objeto req está la propiedad
    // // params, que guarda los parámetros enviados.
    // // Los parámetros en req.params se reciben como strings
    // // parseInt, hace el casteo a valores enteros directamente
    // const id = parseInt(req.params.id);
    // // Devuelve el primer usuario que cumpla con el predicado
    // const usuario = usuarios.find(u => u.id === id);
    const id = req.params.id;
    let usuario = existeUsuario(id);
    if (!usuario){
        res.status(404).send(`El usauiro ${id} no se encuantra`);
        // Devuelve el estado HTTP 404
        return;
    }
    res.send(usuario);
    //* res.send(req.params.id);
});

// Recibiendo varios parámetros
// Se pasan dos parámetros year y month
// Query string
// localhost:5000/api/usuarios/1990/2/?nombre=xxxx&single=y
app.get('/api/usuarios/:year/:month', (req, res) => {
    // En el cuerpo de req está la propiedad 
    // query, que guarda los parametros Query String
    res.send(req.query);
});

// La ruta tiene el musmo nombre que la perición GET
// Express hace ka diferencia dependiendo del tipo de petición
// La peticion POST la vamos a utilizar para insertar
// un nuevo usuario en nuestro arreglo.
app.post('/api/usuarios', (req, res) =>{
    // El objeto request tiene la propiedad body
    // que va a venir en formato JSON
    // Creacion del schema Joi

    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: req.body.nombre
        }; 
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return;
    if(!req.body.nombre || req.body.nombre.length <= 2){
        // Código 400: Bad request
        res.status(400).send('Debe ingreasar un nombre que tenga almenos 3 letras');
        return; // Es necesario para que no continue con el método
    }

    const usuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre
    };
    usuarios.push(usuario);
    res.send(usuario);
});

// Petición para modificar datos existentes
// Este método debe recibir un parámetro
// Id para saber que usuario modificar
app.put('/api/usuarios/:id', (req, res) => {
    // Encontrar si exite el usuario a modificar
    let usuario = existeUsuario(req.params.id);
    // const usuario = usuarios.find(u => u.id === id);
    if(!usuario){
        res.status(404).send('El Usuairo no se encuentra'); // Devuelve el estado HTTP
        return;
    }
    // Validar si el dato recibido es correcto
    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        // Actualiza el nombre
        usuario.nombre = value.nombre
        res.send(usuario);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return; 
}); 

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