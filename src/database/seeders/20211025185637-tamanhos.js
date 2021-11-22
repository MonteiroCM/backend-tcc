'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker/locale/pt_BR')
const tamanhos = []

module.exports = {
  up: async (queryInterface, Sequelize) => {

      const nomes = [
        {nome: 'Gigante', porcentagem: '50'},
        {nome: 'Grande', porcentagem: '20'},
        {nome: 'Normal', porcentagem: '0'},
        {nome: 'Pegueno', porcentagem: '-50'},
      ]

      nomes.forEach(element => {
        categorias.push({
          nome: element,
          created_at: new Date(),
          updated_at: new Date(),
        })
      });

      const [novoCategoria] = await Promise.all([
        queryInterface.bulkInsert('tamanhos', tamanhos, {
          returning: true,
        })
      ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tamanhos', null, {})
  },
};
