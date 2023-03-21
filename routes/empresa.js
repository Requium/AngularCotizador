var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var empresa = require('../models/empresa');

router.get('/', function(req, res, next) {
    empresa.find(function (err,empresas) {
        if(err) return next(err);
        res.json(empresas)
    });
});

router.get('/:name', function(req,res,next){
    console.log('Se esta buscando:',req.params.name);
    console.log(typeof req.params.name);
    empresa.find({'nombre': {"$regex": req.params.name,"$options": "i"}},function (err,post){
        if (err) return next(err);
        console.log(post)
        res.json(post)
    });
})

router.post('/',function(req,res,next){
    console.log(req.body)
    empresa.create(req.body,function (err,post){
        if (err) return next(err);
        res.json(post);
    })
})

router.put('/:id', function(req,res,next){
    console.log(typeof req.params.id)
    console.log(req.params.id)
    empresa.findByIdAndUpdate(req.params.id, req.body, function (err,post){
        if (err){
            console.log(err)
            return next (err)};
            console.log(post)
        res.json(post);
    })
})

router.delete('/:id', function(req,res,next){
    empresa.findByIdAndRemove(req.params.id,req.body,function (err, post){
        if (err) return next (err);
        res.json(post);
    })
})
module.exports = router;