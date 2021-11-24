const { Model, DataTypes } = require('sequelize')

class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        numero: {
          type: DataTypes.INTEGER,
        },
        cliente_id: DataTypes.UUID,
        status: DataTypes.STRING,
        data_pedido: DataTypes.DATEONLY,
      },
      {
        sequelize,
        tableName: 'pedidos',
      }
    )
  }

  static associate(models) {
    this.hasMany(models.PedidoItem, {foreignKey: 'pedido_id', as: 'PedidoItem' });
    this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
  }
}

module.exports = Pedido
