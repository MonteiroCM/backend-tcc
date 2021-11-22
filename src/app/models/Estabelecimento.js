const { Model, DataTypes } = require('sequelize');

class Estabelecimento extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      doc_cnpj: DataTypes.STRING,
      user_id: DataTypes.UUID,
      ativo: DataTypes.BOOLEAN,
    }, {
      sequelize,
      tableName: 'estabelecimentos'
    })
  }

  static associate(models) {
    //this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = Estabelecimento;