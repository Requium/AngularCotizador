var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var index = require('./routes/index');
var users = require('./routes/users');
var empresa = require('./routes/empresa');
var producto = require('./routes/producto');
var uploadimage = require('./routes/uploadimage');
var cotizaciones = require ('./routes/cotizaciones')
var nota = require ('./routes/nota')
var app = express();

mongoose.connect('mongodb://localhost/teracom', {promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit:'50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

app.use('/nota',nota);
app.use('/imageupload', uploadimage);
app.use('/empresa', empresa);
app.use('/producto',producto);
app.use('/cotizaciones',cotizaciones)
app.use('/', express.static(path.join(__dirname, 'dist')));
app.all('*', function(req,res){
  res.redirect('/');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
