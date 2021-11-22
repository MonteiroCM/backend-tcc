const { Model, DataTypes } = require('sequelize');

class ItemVenda extends Model {
  static init(sequelize) {
    super.init({
      produto_id: {type: DataTypes.UUID},
      tamanho_id: {type: DataTypes.UUID},
      valor: {type: DataTypes.DECIMAL},
    }, {
      sequelize,
      tableName: 'tamanho_produto',
      timestamps: false
    })
  }

  static associate(models) {
    this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produtos' });
    this.belongsTo(models.Tamanho, { foreignKey: 'tamanho_id', as: 'tamanhos' });
  }
}

module.exports = ItemVenda;
