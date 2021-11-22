'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker/locale/pt_BR')
const categorias = []

module.exports = {
  up: async (queryInterface, Sequelize) => {

      const nomes = [
        'Pastel',
        'Salgados',
        'Doces',
        'Bolos',
        'Sorvete',
        'Saudável',
        'Pizza',
        'Bebidas',
        'Vegetariana',
      ]

      nomes.forEach(element => {
        categorias.push({
          nome: element,
          created_at: new Date(),
          updated_at: new Date(),
        })
      });

      const [novoCategoria] = await Promise.all([
        queryInterface.bulkInsert('categorias', categorias, {
          returning: true,
        })
      ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categorias', null, {})
  },
};
