const { Model, DataTypes } = require('sequelize')

class PedidoItem extends Model {
  static init(sequelize) {
    super.init(
      {
        pedido_id: {type: DataTypes.UUID},
        produto_id: {type: DataTypes.UUID},
        valor: {type: DataTypes.DECIMAL},
      },
      {
        sequelize,
        tableName: 'pedido_itens',
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedidoitem' });
  }
}

module.exports = PedidoItem
