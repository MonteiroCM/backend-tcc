import { listar, store, login, listarCliente, storeEndereco, listarEndereco, updateEndereco, deleteEndereco } from './app/Controllers/UserController'
import { validateSession, loadSession } from './app/Controllers/AuthController'
import { store as _store, listar as _listar, update} from './app/Controllers/ProdutoController'
import { store as __store, listar as __listar, update as _update, delete as _delete } from './app/Controllers/EstabelecimentoController'
import { store as ___store, listar as ___listar, update as __update, delete as __delete } from './app/Controllers/CategoriaController'
import { store as ____store, listar as ____listar, update as ___update, delete as ___delete } from './app/Controllers/TamanhoController'
import { store as _____store, listar as _____listar, update as ____update, delete as ____delete } from './app/Controllers/ItemVendaController'
import { store as ______store, listar as ______listar, update as _____update } from './app/Controllers/PedidoController'
import { upload } from './app/Controllers/FileController'

function rotas(App) {

App.get('/', (req, res) => {
  res.status(200).send({ message: '😁' })
})

App.get('/users',validateSession, listar)
App.post('/users', store)
App.post('/login', login)
App.get('/clientes',validateSession, listarCliente)

App.post('/loadSession', loadSession)

App.post('/produtos', _store)
App.get('/produtos', _listar)
App.put('/produtos/:id', update)
//App.delete('/produtos/:id', delete)

App.post('/estabelecimentos', __store)
App.get('/estabelecimentos', __listar)
App.put('/estabelecimentos/:id', _update)
App.delete('/estabelecimentos/:id', _delete)

App.post('/categorias', ___store)
App.get('/categorias', ___listar)
App.put('/categorias/:id', __update)
App.delete('/categorias/:id', __delete)

App.post('/tamanhos', ____store)
App.get('/tamanhos', ____listar)
App.put('/tamanhos/:id', ___update)
App.delete('/tamanhos/:id', ___delete)

App.post('/itemvendas', _____store)
App.get('/itemvendas', _____listar)
App.put('/itemvendas/:id', ____update)
App.delete('/itemvendas/:id', ____delete)

//Rotas Pedidos
App.post('/pedidos', ______store)
App.get('/pedidos', ______listar)
App.put('/pedidos/:id', _____update)
App.post('/upload/:id', upload)

App.post('/enderecos', storeEndereco)
App.get('/enderecos', listarEndereco)
App.put('/enderecos/:id', updateEndereco)
App.delete('/enderecos/:id', deleteEndereco)
}

 const _rotas = rotas
export { _rotas as rotas }


