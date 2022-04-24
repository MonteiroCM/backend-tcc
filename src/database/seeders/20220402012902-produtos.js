'use strict'
const databaseConfig = require('../../config/database')
const { Sequelize, Model } = require('sequelize')
const bcrypt = require('bcryptjs')
const faker = require('faker/locale/pt_BR')
const sequelize = new Sequelize(databaseConfig)
var pedido = []
var itens_pedido = []
const numero_pedido = 4786
const status = ['Preparando', 'Liberado', 'Enviado', 'Entreque', 'Cancelado']
const pagamento = ["Cartão de Credito", "Cartão de Debito", "Dinheiro"]

module.exports = {
  up: async (queryInterface, Sequelize) => {

    var asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          i: 0,
          next() {
            if (this.i < 300) {
              return Promise.resolve({ value: this.i++, done: false });
            }

            return Promise.resolve({ done: true });
          }
        };
      }
    };

    (async function() {
       for await (let num of asyncIterable) {

        console.log('==>',num)

        const [result, meta] = await sequelize.query(
          `select count(id) as total from pedidos`,
          { raw: true }
        )

        var total = Object.entries(result[0])

        const [results, metadata] = await sequelize.query(
          `select id from users order by random() limit 1;`,
          { raw: true }
        )

        var valores = Object.entries(results[0])
        var id_user = valores[0][1]

        var statu = status[Math.floor(Math.random()*status.length)];

        var pagamentoTipo = pagamento[Math.floor(Math.random()*pagamento.length)];

        pedido.push({
          numero: parseInt(total[0][1])+parseInt(numero_pedido),
          user_id: id_user,
          status: statu,
          data_pedido: faker.date.between('2020-01-01', '2020-12-31'),
          created_at: new Date(),
          updated_at: new Date(),
        })

        const [results2, metadata2] = await sequelize.query(
          `select * from tamanho_produto order by random() limit (random() * 3)::integer+1`,
          { raw: true }
        )

        const [novoPedido] = await Promise.all([
          queryInterface.bulkInsert('pedidos', pedido, {
            returning: true,
          }),
        ])

        for (let index = 0; index < results2.length; index++) {

          var valores2 = Object.entries(results2[index])

          var id_produto = valores2[2][1]
          var id_tamanho = valores2[1][1]
          var valor = valores2[3][1]

          itens_pedido.push({
            pedido_id: novoPedido[0].id,
            produto_id: id_produto,
            quantidade: (Math.random() * 4)+1,
            valor: valor,
            formapagamento: pagamentoTipo,
            endereco: 'RUA TESTE - ESSE E SO UM ENDEREÇO',
            created_at: new Date(),
            updated_at: new Date()
          })

        }



        const [ItemPedido] = await Promise.all([
          queryInterface.bulkInsert('pedido_itens', itens_pedido, {
            returning: true,
          }),
        ])

        pedido = []
        itens_pedido = []
        console.log(` ${num} ==>`,novoPedido[0].id, ItemPedido[0].id)
       }
    })();


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
