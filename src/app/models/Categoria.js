const { Model, DataTypes } = require('sequelize');

class Categoria extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      ativo: DataTypes.BOOLEAN,
    }, {
      sequelize,
      tableName: 'categorias'
    })
  }

  static associate(models) {
    
  }
}

module.exports = Categoria;
