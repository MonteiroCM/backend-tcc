const Pedido = require('../models/Pedido')
const Cliente = require('../models/Cliente')
const PedidoItem = require('../models/PedidoItem')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET

class PedidoController {
  async store(req, res) {

    if(!req.headers.authorization){
      res.status(400).send({ message: 'Sua sessão é inválida ou está expirada' })
      return
    }

    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(500).send({ message: 'Sua sessão é inválida ou está expirada' })
        return
      }
        if(decoded.userId){
          try {
            const novo = req.body.pedido.pedido
            const items = novo.items

            console.log('novo ', novo)
            console.log('novo > ', novo.cliente_id)


            var now = new Date()
            var isoString = now.toISOString()
            novo.data_pedido = isoString
            novo.status = 'Aberto'

            console.log('cliente >>>> ', novo.cliente_id)

            //const cliente = await Cliente.findOne({ where: { user_id: novo.cliente_id } })


            novo.user_id = novo.cliente_id

            const pedido = await Pedido.create(novo)

            console.log('pedido > ', pedido)

           let itensPedido = []

            await Promise.all([items.forEach(async (element) =>  {
              try {
              console.log('element > ', element)
              //element.pedido_id = pedido.id
              const Item = await PedidoItem.create({
                produto_id: element.produto_id,
                tamanho_id: element.tamanho_id,
                valor: element.valor,
                quantidade: element.quantidade,
                pedido_id: pedido.id,
                formapagamento: novo.formapagamento,
                endereco: novo.endereco,
              })
              //console.log('Item > ', Item)
              itensPedido.push(element)
              }catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
            })])
console.log('itensPedido > ', itensPedido)
//const Item = await PedidoItem.create(itensPedido)


           //Bug tem que ter...
           var pedidoNovo3 = await Pedido.findByPk(pedido.id,{ include: [ { attributes: ['id','produto_id','valor'],  association: 'PedidoItem', include: [
            { attributes: ['nome'],  association: 'produto'},
          ]}]});

            const [pedidoNovo] = await Promise.all([ Pedido.findByPk(pedido.id,{
              attributes: ['id','numero','status','data_pedido'],
              include: [
                { attributes: ['id','nome'],
                association: 'User',},
                { attributes: ['id','produto_id','valor'],  association: 'PedidoItem', include: [
                  { attributes: ['nome'],  association: 'produto'}
                ]},

              ],
            })])

            return res.status(200).json(pedidoNovo)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })


  }

  async listar(req, res) {

      const Pedidos = await Pedido.findAll({
        attributes: ['id','numero','status','data_pedido'],
         order: [
      ['data_pedido', 'DESC'],
      ['numero', 'DESC'],
    ],
    where:{
      status: {
        [Op.ne]: 'Cancelado'
      }
    },
      include: [
        { attributes: ['id','nome'],  association: 'User'},
         { attributes: ['id','produto_id','valor', 'quantidade'],  association: 'PedidoItem', include: [
                  { attributes: ['nome'],  association: 'produto'},
                ]},
      ],
    })

    return res.status(200).json(Pedidos)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { pedido  } = req.body
      console.log('req.body >> ', req.body)
      const [updated] = await Pedido.update(pedido, {
        where: { id: id },
      })

      if (updated) {
        const updatedConta = await Pedido.findOne({ where: { id: id } })
        return res.status(200).json({ pedido: updatedConta })
      }

      throw new Error('Pedido não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const deleted = await Pedido.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        return res.status(200).send({
          message: 'Pedido deletada com sucesso'})
      }
      return res.status(404).send({message: 'Não existe'})
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new PedidoController()
