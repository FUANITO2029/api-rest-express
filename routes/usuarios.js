const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const usuarios = [
    {id:1, nombre:'juan'},
    {id:2, nombre:'Karen'},
    {id:3, nombre:'Diego'},
    {id:4, nombre:'Maria'}
];

ruta.get('/', (req, res) =>{
    res.send(usuarios);
});

// Con los : delante del id
// Express sabe que es un parámetro a recibir en la ruta
ruta.get('/:id', (req, res) => {
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

// La ruta tiene el musmo nombre que la perición GET
// Express hace ka diferencia dependiendo del tipo de petición
// La peticion POST la vamos a utilizar para insertar
// un nuevo usuario en nuestro arreglo.
ruta.post('/', (req, res) =>{
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

// Recibe como párametro el id del usaurio 
// que se va a eliminar
ruta.delete('/:id', (req, res) =>{
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

// Petición para modificar datos existentes
// Este método debe recibir un parámetro
// Id para saber que usuario modificar
ruta.put('/:id', (req, res) => {
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

module.exports = ruta; // Se exprota el objeto ruta