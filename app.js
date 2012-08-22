
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var routes = require('./routes');
var api = require('./routes/api');
var connect = require('connect');

// Configuration

app.configure(function(){
  app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(connect.compress());
  app.use(connect.favicon(__dirname + '/public/favicon.ico', { maxAge: 31557600000 }));
  app.use(express.static(__dirname + '/public', { maxAge: 31557600000 }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
	socket.on('disconnect', function (socket) {
		console.log('disconnected');
	});
});