'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker/locale/pt_BR')
const users = []
const clientes = []

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('123456', 10)


    users.push({
      nome: `Alessandro Nogueira68`,
      email: 'Alessandro.Nogueira68@live.com',
      password: password,
      created_at: new Date(),
      updated_at: new Date(),
    })

    for (var i = 0; i < 100; i++) {
      let nome = faker.name.firstName()
      let sobrenome = faker.name.lastName()

      users.push({
        nome: `${nome} ${sobrenome}`,
        email: faker.internet.email(nome, sobrenome),
        password: password,
        created_at: new Date(),
        updated_at: new Date(),
      })

      const [novoUser] = await Promise.all([
        queryInterface.bulkInsert('users', users, {
          returning: true,
        })
      ]);

      console.log(novoUser[0].id)

      clientes.push({
        doc_cpf: faker.address.zipCode(),
        dt_nascimento: faker.date.past(),
        user_id: novoUser[0].id,
        created_at: new Date(),
        updated_at: new Date(),
      })

      const [novoCliente] = await Promise.all([
        queryInterface.bulkInsert('clientes', clientes, {
          returning: true,
        })
      ]);


      console.log(`--> ${novoCliente[0].id}`)

    }


  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  },
}
