var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Empresa = require('../models/empresa');
var Cotizacion = require('../models/cotizacion');
var moment = require('moment');
var pdf = require('../PDF')
router.get('/', function(req, res, next) {
    Empresa.find(function (err,empresas) {
        if(err) return next(err);
        res.json(empresas)
    });
});
router.get('/editnota/:name', function(req,res,next){
    console.log('Se esta buscando:',req.params.name);
    console.log(typeof req.params.name);
    Empresa.findOne({'nombre': {"$regex": req.params.name,"$options": "i"}})
    .then((data)=> { 
        Cotizacion.find({
            "notas.0":{"$exists":true},
            empresa: data._id}).then((cot) => {
        res.json(cot)
      })
    })
})

router.post('/search',function(req,res,next){
    console.log('post edit',req.body)
    Empresa.findOne({'nombre': req.body.empresa})
    .populate({
        path:'cotizacion',
        match:{
            id:req.body.Id
        }
    })
    .then(
        (data) => {
            res.json(data.cotizacion[0])
            console.log(data.cotizacion[0].productos)
        }
    )
    // .then((data)=> {
    //     console.log(data._id)
    //    Nota.findOne({'cotizacion.0': data._id}).then(result => res.json(result.productos))
    // })
})


router.get('/edit/:name', function(req,res,next){
    console.log('Se esta buscando:',req.params.name);
    console.log(typeof req.params.name);
    Empresa.findOne({'nombre': {"$regex": req.params.name,"$options": "i"}})
    .then((data)=> { 
        Cotizacion.find({
            "notas.0":{"$exists":false},
            empresa: data._id}).then((cot) => {
        res.json(cot)
      })
    })
})

router.get('/:name', function(req,res,next){
    console.log('Se esta buscando:',req.params.name);
    console.log(typeof req.params.name);
    Empresa.findOne(
        {'nombre': {"$regex": req.params.name,"$options": "i"},})
    .populate('cotizacion')
    .then((data)=> {
       res.json(data.cotizacion)
    })
})

router.post('/imprimir',function(req,res,next){
    var producto= [];
    console.log(req.body.cotproductos.creado)
    var dates = Date.parse(req.body.cotproductos.creado)
    var date = new Date(dates).toISOString()
    console.log('Fecha:',date,typeof date)

    for(var i = 0; i < req.body.cotproductos.productos.length;i++){
        producto.push(
        {
             Item: i+1,
             Descripcion: req.body.cotproductos.productos[i].modelo + '\n' + '\n' + req.body.cotproductos.productos[i].descripcion,
             Imagen: req.body.cotproductos.productos[i].imagen,
             Cantidad: [req.body.cotproductos.productos[i].cantidad.toString()],
             'Precio Unitario Bs.': [req.body.cotproductos.productos[i].preciov.toString()],
             'Total Bs.': req.body.cotproductos.productos[i].subtotal
        })}
        console.log('El gran Total es:',req.body.cotproductos.total)
        pdf.pdfCot(
                req.body.empresa,
                producto,
                req.body.cotproductos.total,
                req.body.cotproductos.id,
                req.body.cotproductos.nota,
                req.body.cotproductos.encargadoModificado,
                req.body.cotproductos.diasEntregaModificado,
                req.body.cotproductos.adelantoModificado,
                req.body.cotproductos.facturaVenta,
                req.body.cotproductos.creado,
                function(binary){
                    res.contentType('application/json');
                    var bin = binary.match(/base64,(.*)/)
                    res.send(bin[1]);
                    // console.log(bin[1])
                 },
                  function(error) {
                    res.send('ERROR:' + error);
                })
})

router.post('/',function(req,res,next){
    // console.log(req.body)
    empresa = new Empresa(req.body.empresa);
    cotizaciones = new Cotizacion(req.body.cotproductos);
    cotizaciones.empresa.push(empresa);
    // console.log(cotizaciones)
    Empresa.findOneAndUpdate({nombre:req.body.empresa.nombre},{$push:{cotizacion: cotizaciones._id}}).then(result => {
    });
    cotizaciones.save() 
    res.json('Base de datos Guardada')
 })


router.put('/:id', function(req,res,next){
    console.log('put',req.body.cotproductos.adelantoModificado)
    console.log(req.params.id)
        Cotizacion.findByIdAndUpdate(req.params.id, req.body.cotproductos).then(
            console.log('Base de datos Guardada')
        )
        res.json('Base de datos Guardada')   

    // req.body.creado = new Date() - 4*60*60*1000 
    // console.log (req.body)
    // Cotizacion.findOneAndUpdate({id:req.params.id},{$set:req.body}, function (err,post){
    //     if (err) return next (err);
    //     res.json(post);
    // })
   
})
router.post('/delete', function(req,res,next){
    // console.log(req.body)
    Empresa.findOne({nombre:req.body.empresa})
    .populate({
        path:'cotizacion',
        match:{
            id:req.body.Id
        }
    })
    .then(
        (data) => {
            console.log(data)
            if (data.cotizacion[0].notas.length > 0)
            res.json('No se puede eliminar, Tiene productos ya entregados')
            else
            Cotizacion.findByIdAndRemove(data.cotizacion[0]._id)
            .then(data => console.log('Cotizacion Eliminada'))
            Empresa.update({nombre:req.body.empresa},{$pullAll:{cotizacion:[data.cotizacion[0]._id]}})
            .then(data => console.log('Relacion Eliminada'))
            res.json('Cotizacion Eliminada')

        }
    )
})

router.delete('/:id', function(req,res,next){
    Cotizacion.findByIdAndRemove(req.params.id)
    .then (
        data => {
            console.log(data)
            res.json(data)
        }
    )
})
module.exports = router;