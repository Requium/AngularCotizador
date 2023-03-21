var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;
var  NotaProductos = require('./notaproductos')
var Nota = new Schema({
    productos: [NotaProductos],
    nota:String,
    encargadoEntrega:String,
    encargadoRecepcion:String,
    cotizacion: [{
        type: Schema.Types.ObjectId,ref:'Cotizaciones'
    }],
    creado: { type : Date, default:+new Date() - 4*60*60*1000 },
});

module.exports = mongoose.model('Notas', Nota);
