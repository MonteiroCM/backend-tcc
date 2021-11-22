'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('tamanho_produto', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal(
          'uuid_in(md5(random()::text || clock_timestamp()::text)::cstring)'
        ),
        allowNull: false,
        primaryKey: true,
      },
      tamanho_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'tamanhos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      produto_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      valor: {
        allowNull: true,
        type: Sequelize.DECIMAL(12, 2),
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tamanho_produto')
  },
}
