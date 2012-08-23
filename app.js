// Generated by CoffeeScript 1.3.3
(function() {
  var api, app, connect, db, express, io, mongoose, routes, server;

  express = require('express');

  app = express();

  server = app.listen(3000);

  io = require('socket.io').listen(server);

  routes = require('./routes');

  api = require('./routes/api');

  connect = require('connect');

  mongoose = require('mongoose');

  db = mongoose.createConnection('localhost', 'cookbook');

  app.configure(function() {
    app.set('port', 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
      layout: false
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(connect.compress());
    app.use(connect.favicon(__dirname + '/public/favicon.ico', {
      maxAge: 31557600000
    }));
    app.use(express["static"](__dirname + '/public', {
      maxAge: 31557600000
    }));
    return app.use(app.router);
  });

  db.on('error', console.error.bind(console, 'connection error.'));

  db.once('open', function() {
    var _this = this;
    return io.sockets.on('connection', function(socket) {
      var EmployeeModel, employeeSchema;
      console.log('Database opened');
      employeeSchema = new mongoose.Schema({
        name: String,
        age: String
      });
      EmployeeModel = db.model('Employee', employeeSchema);
      socket.on('save', function(data) {
        var employeeDocument;
        employeeDocument = new EmployeeModel(data);
        console.log(employeeDocument.name);
        return employeeDocument.save(function(err) {
          if (err) {
            console.log("Error on saving document!");
          }
          return console.log("Document is saved!");
        });
      });
      return socket.on('disconnect', function(socket) {
        return console.log('disconnected');
      });
    });
  });

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', routes.index);

  app.get('/partials/:name', routes.partials);

  app.get('/api/name', api.name);

  app.get('*', routes.index);

}).call(this);
