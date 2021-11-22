const { Model, DataTypes } = require('sequelize');

class Endereco extends Model {
  static init(sequelize) {
    super.init({
      rua: DataTypes.STRING,
      numero: DataTypes.STRING,
      cep: DataTypes.STRING,
      bairro: DataTypes.STRING,
      cidade: DataTypes.STRING,
      user_id: {type: DataTypes.UUID},
      ativo: DataTypes.BOOLEAN,
    }, {
      sequelize,
      tableName: 'enderecos'
    })
  }

  static associate(models) {

  }
}

module.exports = Endereco;
