const { Model, DataTypes } = require('sequelize');

class Produto extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      descricao: DataTypes.STRING,
      imagem: DataTypes.STRING,
      categoria_id: DataTypes.UUID,
      ativo: DataTypes.BOOLEAN,
    }, {
      sequelize,
      tableName: 'produtos'
    })
  }

  static associate(models) {
    this.belongsTo(models.Categoria, { foreignKey: 'categoria_id', as: 'categorias' });
  }
}

module.exports = Produto;
