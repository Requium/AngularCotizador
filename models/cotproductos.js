var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;

const Cotproductos = new Schema({
        cantidad: Number,
        descripcion: String,
        garantia: String,
        imagen: String,
        marca: String,
        modelo: String,
        precioc: Number,
        facturaCompra: Boolean,
        preciov: Number,
        unidad: String,
        subtotal: Number,
        subtotalCompra: Number,
       
})

module.exports = Cotproductos;