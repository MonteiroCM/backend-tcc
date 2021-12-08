const { Model, DataTypes } = require('sequelize')

class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        numero: {
          type: DataTypes.INTEGER,
        },
        user_id: DataTypes.UUID,
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
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
  }
}

module.exports = Pedido
