const databaseConfig = require("../../config/database");
const { Sequelize, Model } = require("sequelize");

const User = require("./User");
const Produto = require("./Produtos");
const Estabelecimento = require("./Estabelecimento");
const Categoria = require("./Categoria");
const Tamanho = require("./Tamanho");
const ItemVenda = require("./ItemVenda");
const Pedido = require("./Pedido");
const Cliente = require("./Cliente");
const PedidoItem = require("./PedidoItem");
const Endereco = require("./Endereco");

const models = [User, Categoria, Produto, Estabelecimento, Tamanho, ItemVenda, Pedido, Cliente, PedidoItem, Endereco];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))

    models
    .map(
      (model) => model.associate && model.associate(this.connection.models)
    )

    console.log(models)
  }
}

module.exports = new Database();
