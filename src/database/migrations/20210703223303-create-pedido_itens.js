'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('pedido_itens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal(
          'uuid_in(md5(random()::text || clock_timestamp()::text)::cstring)'
        ),
        allowNull: false,
        primaryKey: true,
      },
      pedido_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'pedidos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      produto_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantidade: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      valor: {
        allowNull: true,
        type: Sequelize.DECIMAL(12,4),
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pedido_itens')
  },
}
