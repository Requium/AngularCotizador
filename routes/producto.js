var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var producto = require('../models/producto');

router.get('/', function(req, res, next) {
    producto.find(function (err,productos) {
        if(err) return next(err);
        res.json(productos)
    });
});


router.get('/:name', function(req,res,next){
    console.log('Se esta buscando:',req.params.name);
    console.log(typeof req.params.name);
    producto.find({$or:[
        {'modelo': {'$regex':req.params.name,"$options": "i"}},
        {'marca':  {'$regex':req.params.name,"$options": "i"}},
        {'proveedor': {'$regex':req.params.name,"$options": "i"}},
        {'descripcion:': {'$regex':req.params.name,"$options": "i"}}
        ]},function (err,post){
        if (err) return next(err);
        res.json(post)
    })
})

router.post('/',function(req,res,next){
    producto.create(req.body,function (err,post){
        if (err) return next(err);
        res.json(post);
    })
})

router.put('/:id', function(req,res,next){
    producto.findByIdAndUpdate(req.params.id, req.body, function (err,post){
        if (err) return next (err);
        res.json(post);
    })
})

router.delete('/:id', function(req,res,next){
    producto.findByIdAndRemove(req.params.id,req.body,function (err, post){
        if (err) return next (err);
        res.json(post);
    })
})
module.exports = router;