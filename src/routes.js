const UserController = require('/app/Controllers/UserController.js')
const AuthController = require('./app/Controllers/AuthController.js')
const ProdutoController = require('./app/Controllers/ProdutoController.js')
const EstabelecimentoController = require('./app/Controllers/EstabelecimentoController.js')
const CategoriaController = require('./app/Controllers/CategoriaController.js')
const TamanhoController = require('./app/Controllers/TamanhoController.js')
const ItemVendaController = require('./app/Controllers/ItemVendaController.js')
const PedidoController = require('./app/Controllers/PedidoController.js')
const FileController = require('./app/Controllers/FileController.js')

function rotas(App) {

App.get('/', (req, res) => {
  res.status(200).send({ message: '😁' })
})

App.get('/users',AuthController.validateSession, UserController.listar)
App.post('/users', UserController.store)
App.post('/login', UserController.login)
App.get('/clientes',AuthController.validateSession, UserController.listarCliente)

App.post('/loadSession', AuthController.loadSession)

App.post('/produtos', ProdutoController.store)
App.get('/produtos', ProdutoController.listar)
App.put('/produtos/:id', ProdutoController.update)
App.delete('/produtos/:id', ProdutoController.delete)

App.post('/estabelecimentos', EstabelecimentoController.store)
App.get('/estabelecimentos', EstabelecimentoController.listar)
App.put('/estabelecimentos/:id', EstabelecimentoController.update)
App.delete('/estabelecimentos/:id', EstabelecimentoController.delete)

App.post('/categorias', CategoriaController.store)
App.get('/categorias', CategoriaController.listar)
App.put('/categorias/:id', CategoriaController.update)
App.delete('/categorias/:id', CategoriaController.delete)

App.post('/tamanhos', TamanhoController.store)
App.get('/tamanhos', TamanhoController.listar)
App.put('/tamanhos/:id', TamanhoController.update)
App.delete('/tamanhos/:id', TamanhoController.delete)

App.post('/itemvendas', ItemVendaController.store)
App.get('/itemvendas', ItemVendaController.listar)
App.put('/itemvendas/:id', ItemVendaController.update)
App.delete('/itemvendas/:id', ItemVendaController.delete)

//Rotas Pedidos
App.post('/pedidos', PedidoController.store)
App.get('/pedidos', PedidoController.listar)
App.put('/pedidos/:id', PedidoController.update)
App.post('/upload/:id', FileController.upload)

App.post('/enderecos', UserController.storeEndereco)
App.get('/enderecos', UserController.listarEndereco)
App.put('/enderecos/:id', UserController.updateEndereco)
App.delete('/enderecos/:id', UserController.deleteEndereco)
}

 exports.rotas = rotas


