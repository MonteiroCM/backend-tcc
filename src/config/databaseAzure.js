module.exports = {
  dialect: 'postgres',
  username: 'adm_clayton@claytonsrv.postgres.database.azure.com',
  password: 'Banco10203040',
  port: '5432',
  database: 'needfood',
  host: 'claytonsrv.postgres.database.azure.com',
  operatorAliases: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {
    encrypt: true,
    ssl : {
      rejectUnauthorized: false
    }
  }
}
