
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  connect = require('connect');

var app = express();

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
  app.use(connect.favicon(__dirname + 'public/favicon.ico'));
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

app.listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
  // console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
