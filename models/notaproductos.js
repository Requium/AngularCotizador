var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;

const NotaProductos = new Schema({
        modelo: String,
        marca: String,
        numeroserie: String,
})

module.exports = NotaProductos;