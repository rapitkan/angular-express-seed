
 # Module dependencies.

express = require 'express'
app = express()
server = app.listen 3000
io = require('socket.io').listen server
routes = require './routes'
api = require './routes/api'
connect = require 'connect'
mongoose = require 'mongoose'
db = mongoose.createConnection('localhost', 'test')

# Configuration

app.configure ->
  app.set 'port', 3000
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.set 'view options',
    layout: false
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use connect.compress()
  app.use connect.favicon __dirname + '/public/favicon.ico', { maxAge: 31557600000 }
  app.use express.static __dirname + '/public', { maxAge: 31557600000 }
  app.use app.router


# Mongoose section

db.on 'error', console.error.bind(console, 'connection error.')
db.once 'open', ->
  # Start server
  io.sockets.on 'connection', (socket) =>
    console.log 'Database opened'
    employeeSchema = new mongoose.Schema
      name: String
      age: String
    EmployeeModel = db.model 'Employee', employeeSchema
    socket.on 'save', (data) =>
      employeeDocument = new EmployeeModel data
      console.log employeeDocument.name
      employeeDocument.save (err) ->
        if err
          console.log "Error on saving document!"
        console.log "Document is saved!"
    socket.on 'disconnect', (socket) =>
      console.log 'disconnected'

app.configure 'development', ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true

app.configure 'production', ->
  app.use express.errorHandler()

# Routes

app.get '/', routes.index
app.get '/partials/:name', routes.partials

# JSON API

app.get '/api/name', api.name

# redirect all others to the index (HTML5 history)

app.get '*', routes.index