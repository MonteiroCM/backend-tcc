require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

var loc = window.location.pathname;
var dir = loc.substring(0, loc.lastIndexOf('/'));


console.log('dir >>', dir)

const routes = require('./routes')

console.log('APP', routes)

require('./app/models')

const App = express()

global.__basedir = __dirname;

App.use(express.static('resources'))
App.use(express.static('files'))

App.use('/resources', express.static('resources'))
App.use('/resources', express.static(path.join(__dirname, 'resources')))

App.use(cors())
App.use(bodyParser.urlencoded({ extended: false }))
App.use(bodyParser.json())

routes.rotas(App)

App.use((req, res, next) => {
  res.status(404).send({ error: '404 - Caminho não encontrado' })
})

const PORT = process.env.PORT || 5000

App.listen(PORT, () => console.log(`Serviços disponíveis na porta ${PORT}`))
