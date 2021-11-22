const { Model, DataTypes } = require('sequelize');

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      user_id: DataTypes.UUID,
      doc_cpf: DataTypes.STRING,
      dt_nascimento: DataTypes.DATEONLY,
    }, {
      sequelize,
      tableName: 'clientes'
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = Cliente;
