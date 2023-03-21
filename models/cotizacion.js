var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;
var   Cotproductos = require('./cotproductos')
var Cotizacion = new Schema({
    productos: [Cotproductos],
    id: String,
    empresa: [{
        type: Schema.Types.ObjectId, ref:'Empresas'
    }],
    notas: [{
        type: Schema.Types.ObjectId, ref:'Notas'
    }],
    creado: { type : Date, default:+new Date() - 4*60*60*1000 },
    nota: String,
    total: Number,
    totalCompra: Number,
    facturaVenta: Boolean,
    creditoFiscal:Number,
    impuestoFacturaIVA:Number,
    IVACompra:Number,
    IVAVenta:Number,
    ITVenta:Number,
    utilidad:Number,
    encargadoModificado:String,
    diasEntregaModificado:Number,
    adelantoModificado:Number
});

module.exports = mongoose.model('Cotizaciones', Cotizacion);
