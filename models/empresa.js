var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;
var Empresa = new Schema({
    nombre : String,
    encargado: String,
    siglas: String,
    email: String,
    direccion: String,
    telefono: Number,
    razonsocial: String,
    nit: Number,
    cotizacion: [{
        type: Schema.Types.ObjectId,ref:'Cotizaciones'
    }],


});

module.exports = mongoose.model('Empresas', Empresa);
