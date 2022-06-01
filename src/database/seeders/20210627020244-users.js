'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker/locale/pt_BR')
const users = []
const clientes = []

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('123456', 10)


    users.push({
      nome: `Cliente`,
      email: 'cliente@cliente.com.br',
      tipo: 'CLIENTE',
      password: password,
      created_at: new Date(),
      updated_at: new Date(),
    })

    users.push({
      nome: `Administrador`,
      email: 'admin@admin.com.br',
      tipo: 'ADMIN',
      password: password,
      created_at: new Date(),
      updated_at: new Date(),
    })

    for (var i = 0; i < 10; i++) {
      let nome = faker.name.firstName()
      let sobrenome = faker.name.lastName()

      users.push({
        nome: `${nome} ${sobrenome}`,
        email: faker.internet.email(nome, sobrenome),
        tipo: 'CLIENTE',
        password: password,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
    const [novoUser] = await Promise.all([
      queryInterface.bulkInsert('users', users, {
        returning: true,
      })
    ]);

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  },
}
