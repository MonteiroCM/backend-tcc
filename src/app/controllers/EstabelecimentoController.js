const Estabelecimento = require('../models/Estabelecimento')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

class EstabelecimentoController {
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
            const novo = req.body.Estabelecimento
           // novo.user_id = decoded.userId
           console.log('novo ', novo)
            const estabelecimento = await Estabelecimento.create(novo)
            return res.status(200).json(estabelecimento)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })

  
  }

  async listar(req, res) {
    const Estabelecimentos = await Estabelecimento.findAll({
      include: [
        { attributes: ['id','nome'],  association: 'user'},
      ],
    })

    return res.status(200).json(Estabelecimentos)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const [updated] = await Estabelecimento.update(req.body, {
        where: { id: id },
      })
      if (updated) {
        const updatedConta = await Estabelecimento.findOne({ where: { id: id } })
        return res.status(200).json({ post: updatedConta })
      }
      throw new Error('Lançamento não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const deleted = await Lançamento.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        console.log('Lançamento deletada com sucesso')
        return res.status(200).send({
          message: 'Lançamento deletada com sucesso'})
      }
      throw new Error('Lançamento não existe')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new EstabelecimentoController()
