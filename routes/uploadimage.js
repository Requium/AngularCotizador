var express = require('express')
var router = express.Router()
var fs = require('fs');
var base64Img = require('base64-img');
var mongoose = require('mongoose');
var producto = require('../models/producto');


router.post('/', function(req, res,next) {
    // console.log(req.body)
    base64Img.img(req.body.data, '', './public/images/'+req.body.archivo, function(err, filepath) {
        if (err){
            console.log(err)
        }
        else{
        producto.update({"modelo":req.body.archivo},{$set: {"imagen":filepath}},function (err,post){
            if (err) return next(err)
        console.log('Base dedatos:',post)})
        console.log('Se escribio en' + filepath)
    }});

        
    res.json({'message':'File Upload Completado!'})
})

module.exports = router