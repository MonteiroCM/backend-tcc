'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('pedido_itens',
      'endereco',
     Sequelize.STRING
    );

  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'pedido_itens',
      'endereco'
    );
  }
}
