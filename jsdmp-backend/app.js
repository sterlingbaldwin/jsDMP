var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var jsdmp = require('./jsdmp');
var integrator = require('./newtonian_integrator');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

integrator.init({
  start_pos: 100,
  stop_pos: 600,
  step_size: 0.1
});
jsdmp.init({
  generator: integrator.generator,
  aggregator: integrator.aggregator,
  compute_function: integrator.compute_function,
  num_jobs: integrator.num_jobs,
  job_size: integrator.job_size
});

var io = require('socket.io')(8080);
io.on('connection', function(client) {
  jsdmp.connected(client);
  client.on('job:update', jsdmp.update(data));
  client.on('job:completed', jsdmp.completed(data));
  client.on('job:request', jsdmp.dispatch(data))
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

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
