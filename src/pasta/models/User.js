const Sequelize = require('sequelize')
const { Model } = require('sequelize')

class User extends Sequelize.Model {
    static init(sequelize){
        super.init(
            {
                nome: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.STRING,
                tipo: Sequelize.STRING,
            },{
                sequelize
            }
        )
    }
    static associate(models) {
       // this.hasMany(models.Banco, { foreignKey: 'user_id', as: 'bancos' })
        //this.belongsToMany(models.StockExchange, {foreignKey: 'user_id', 
       // through: 'stock_exchange_user', as: 'stock_exchange'});
      }
}

module.exports = User