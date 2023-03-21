var express = require('express');
var router = express.Router();
var Empresa = require('../models/empresa');
var Cotizacion = require('../models/cotizacion');
var Nota = require('../models/nota');
var pdf = require('../PDF')

router.get('/:name', function(req, res, next) {
    Empresa.findOne({'nombre': {"$regex": req.params.name,"$options": "i"}})
    .populate({
        path:'cotizacion',
        match:{notas:{$exists:true, $ne: [] }},
        populate:{path:'notas'}
    })
    .then((data)=> {
        console.log(data.cotizacion.length)
        res.json(data.cotizacion)
    })


});
router.get('/edit/:name',function(req,res,next){
    Cotizacion.findOne({'id': {"$regex": req.params.name,"$options": "i"}})
    .then((data)=> {
        console.log(data._id)
       Nota.findOne({'cotizacion.0': data._id}).then(result => res.json(result))
    })
})
router.post('/edit',function(req,res,next){
    console.log('post add',req.body)
    Empresa.findOne({'nombre': req.body.empresa})
    .populate({
        path:'cotizacion',
        match:{
            id: req.body.Id
        },
        populate:{
            path:'notas'}
    })
    .then(
        (data) => {
            console.log(data.cotizacion[0].notas[0].productos)
            res.json(data.cotizacion[0].notas[0].productos)
            console.log(data.cotizacion[0].notas[0].productos)
        }
    )
});

router.post('/add',function(req,res,next){
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
            res.json(data.cotizacion[0].productos)
            console.log(data.cotizacion[0].productos)
        }
    )
    // .then((data)=> {
    //     console.log(data._id)
    //    Nota.findOne({'cotizacion.0': data._id}).then(result => res.json(result.productos))
    // })
})


router.get('/:name', function(req,res,next){
    console.log('Se esta buscando:',req.params.name);
    console.log(typeof req.params.name);
    Empresa.findOne({'id': {"$regex": req.params.name,"$options": "i"}})
    .then((data)=> {
        console.log(data)
       res.json(data.productos)
    })
})

router.post('/imprimir',function(req,res,next){
    Empresa.findOne({nombre:req.body.nombre})
    .then((data)=> {
             console.log('Empresa:',data)
            empresa = data}).then(()=>{
            
                var producto= [];
                // console.log(req.body.notProductos)
                for(var i = 0; i < req.body.notaEntrega.productos.length;i++){
                producto.push(
                {
                     Item: i+1,
                     Descripcion: req.body.notaEntrega.productos[i].modelo,
                     'Numero de Serie': req.body.notaEntrega.productos[i].numeroserie,
                     Marca: req.body.notaEntrega.productos[i].marca
                     }
                    )}
                    // console.log(empresa.nombre)
                pdf.pdfNota(
                        empresa,
                        producto,
                        req.body.Id,
                        req.body.notaEntrega.nota,
                        req.body.notaEntrega.encargadoRecepcion,
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
})


router.put('/',function(req,res,next){
    Empresa.findOne({'nombre':req.body.nombre})
    .populate({
        path:'cotizacion',
        match:{
            id: req.body.Id
        },
        populate:{
            path:'notas'}
    
    }).then((data)=> {
        var nota = data.cotizacion[0].notas[0]
        Nota.findByIdAndUpdate(nota._id, req.body.notaEntrega).then(
            console.log('Base de datos Guardada')
        )
        res.json('Base de datos Guardada')

    })
   
})

router.post('/',function(req,res,next){
 console.log(req.body.nombre)
 Empresa.findOne({'nombre':req.body.nombre})
    .populate({
        path:'cotizacion',
        match:{
            id: req.body.Id
        }
    }).then((data)=> {
        console.log('la data es:',data)
        cotizacion = data.cotizacion[0];
        console.log('cotizacion es',cotizacion)
        notas =new Nota(req.body.notaEntrega)
        notas.cotizacion.push(cotizacion)
        console.log(cotizacion._id)
        Cotizacion.findOneAndUpdate({_id:cotizacion._id},{$push:{notas:notas._id}})
        .then(result => {
            console.log(result)
            notas.creado = new Date() - 4*60*60*1000 
            console.log(notas)
            notas.save();
            res.json('Base de datos Guardada')
        })
      })
 
})


router.put(':/id', function(req,res,next){
    Empresa.findByIdAndUpdate(req.param.id, req.body, function (err,post){
        if (err) return next (err);
        res.json(post);
    })
})

router.delete('/:id', function(req,res,next){
    Empresa.findByIdAndRemove(req.params.id,req.body,function (err, post){
        if (err) return next (err);
        res.json(post);
    })
})
router.delete('/porcotizacion/:id',function(req,res,next){
    Nota.findOneAndRemove({'cotizacion':req.params.id}).then(data => {
        res.json(data)
    })
})
module.exports = router;