var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;
var Producto = new Schema({
    modelo : String,
    descripcion: String,
    garantia: String,
    imagen:String,
    precioc: Number,
    preciov: Number,
    unidad: String,
    marca: String,
    proveedor: String,
    servicio: Boolean,
    area: String
    


});

module.exports = mongoose.model('Productos', Producto);