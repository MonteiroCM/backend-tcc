const Produto = require('../models/Produtos')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

class ProdutoController {
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
            const novo = req.body.produto
           // novo.user_id = decoded.userId
            console.log('novo ', novo)
            const produto = await Produto.create(novo)
            return res.status(200).json(produto)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })
  }

  async listar(req, res) {
    const Produtos = await Produto.findAll({
      include: [
        { attributes: ['id','nome'],  association: 'categorias'},
      ],
    })

    return res.status(200).json(Produtos)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { produto  } = req.body
      console.log('req.body >> ', req.body)
      const [updated] = await Produto.update(produto, {
        where: { id: id },
      })

      if (updated) {
        const updatedConta = await Produto.findOne({ where: { id: id } })
        return res.status(200).json({ novo: updatedConta })
      }

      throw new Error('Produto não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const deleted = await Produto.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        console.log('Produto deletada com sucesso')
        return res.status(200).send({
          message: 'Produto deletada com sucesso'})
      }
      throw new Error('Produto não existe')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new ProdutoController()
