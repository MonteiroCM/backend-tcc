const { Model, DataTypes } = require('sequelize');

class Tamanho extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      porcentagem: DataTypes.DECIMAL,
      ativo: DataTypes.BOOLEAN,
    }, {
      sequelize,
      tableName: 'tamanhos'
    })
  }

  static associate(models) {
    
  }
}

module.exports = Tamanho;
