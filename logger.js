function log(req, res, next){
    console.log('logging...');
    next(); //Le indica a Express que llame a la siguiente función middleware
            // o a la peticion correspondiente
            // Si no lo indicamos, Express se queda dentro de esta función 
}

module.exports = log;