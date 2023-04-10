const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const productos = [
    {id:1, nombre:'Ratón'},
    {id:2, nombre:'Teclado'},
    {id:3, nombre:'Monitor 24"'},
    {id:4, nombre:'Cable HDMI'}
];

ruta.get('/', (req, res) =>{
    res.send(productos);
});

ruta.get('/:id', (req, res) => {
    const id = req.params.id;
    let producto = existeProducto(id);
    if (!producto){
        res.status(404).send(`El producto ${id} no se encuantra`);
        return;
    }
    res.send(producto);
});

function existeProducto(id){
    return (productos.find(p => p.id === parseInt(id)));
}

function validarProducto(nom){
    const schema = Joi.object({
        nombre: Joi.string()
                .min(3)
                .required()
    })
    return schema.validate({nombre:nom});
};

ruta.post('/', (req, res) =>{
    const {error, value} = validarProducto(req.body.nombre);
    if(!error){
        const producto = {
            id: productos.length + 1,
            nombre: req.body.nombre
        }; 
        productos.push(producto);
        res.send(producto);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return;
});

ruta.put('/:id', (req, res) => {
    const id = req.params.id;
    let producto = existeProducto(id);
    if(!producto){
        res.status(404).send(`El Producto ${id} no se encuentra`); // Devuelve el estado HTTP
        return;
    }
    const {error, value} = validarProducto(req.body.nombre);
    if(!error){
        producto.nombre = value.nombre
        res.send(producto);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return; 
}); 

ruta.delete('/:id', (req, res) =>{
    const id = req.params.id;
    let producto = existeProducto(id);
    if(!producto){
        res.status(404).send(`El Producto ${id} no se encuentra`);
        return;
    }
    const index = productos.indexOf(producto);
    productos.splice(index, 1);
    res.send(producto); 
    return;
});

module.exports = ruta;