const ItemVenda = require('../models/ItemVenda')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

class ItemVendaController {
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

      console.log('req.body ', req.body)
        if(decoded.userId){
          try {
            const novo = req.body.itemvenda
           // novo.user_id = decoded.userId
            console.log('itemvenda novo ', novo)
            const itemvenda = await ItemVenda.create(novo)
            console.log('itemvenda novo 2', itemvenda)
            return res.status(200).json(itemvenda)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })


  }

  async listar(req, res) {
    console.log('listar >', ItemVenda)
    const ItemVendas = await ItemVenda.findAll({
      include: [
        { attributes: ['id','nome'],  association: 'tamanhos'},
        { attributes: ['id','nome', 'descricao', 'imagem'],  association: 'produtos'},
      ],
    })
    //console.log('ItemVendas >', ItemVendas)
    return res.status(200).json(ItemVendas)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { itemvenda  } = req.body
      console.log('req.body >> ', req.body)
      const [updated] = await ItemVenda.update(itemvenda, {
        where: { id: id },
      })

      if (updated) {
        const updatedConta = await ItemVenda.findOne({ where: { id: id } })
        return res.status(200).json({ novo: updatedConta })
      }

      throw new Error('ItemVenda não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const deleted = await ItemVenda.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        return res.status(200).send({
          message: 'ItemVenda deletada com sucesso'})
      }
      return res.status(404).send({message: 'Não existe'})
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new ItemVendaController()
