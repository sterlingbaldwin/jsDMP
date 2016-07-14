var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var jsdmp = require('./jsdmp.js');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var hbs = exphbs.create({ /* config */ });
// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


var generator = function(current, step, compute){
  var job = {
    data: {
      start: this.current_position,
      end: this.current_position + this.step_size
    },
    compute_function: this.compute_function
  };
  this.current_position += this.step_size;
  this.jobq.push(job);
}
var aggregator = function(data){
  return this.total += data.result;
}
var compute_function = function(args){
  var a = args.a;
  var b = args.b;
  var step_size = args.step_size;
  var start = Math.cos(a/3) - Math.cos(a/5) + Math.sin(a/4) + 8;
  var stop = Math.cos(b/3) - Math.cos(b/5) + Math.sin(b/4) + 8;
  return ((start + stop)/2) * step_size;
}
var start = 100;
var stop = 600;
var step_size = (stop-start)/10000000;
jsdmp.init({
  step_size: step_size,
  generator: generator,
  aggregator: aggregator,
  compute_function: compute_function
});
jsdmp.current_position = start;
jsdmp.start = start;
jsdmp.end = stop;
console.log(jsdmp);
// var http = require('http');
// var server= http.createServer(handler);
// var io = require('socket.io')(server);
//
// server.listen(8080);
var io = require('socket.io')(8080);
io.on('connection', function(client){
  client.on('init', function(data){
    console.log('Client connected');
  });

  client.on('disconnect', function(data){
    console.log('client disconnected');
  });

  client.on('job:request', function(data){
    jsdmp.generator();
    var job = jsdmp.jobq.pop();
    if(!job.data.start){
      jsdmp.generator();
      job = jsdmp.jobq.pop();
    }
    job = JSON.stringify(job);
    console.log(job);
    client.emit('job:new_job', job);
  });
});




// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
