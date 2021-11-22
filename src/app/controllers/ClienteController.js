const Cliente = require('../models/Cliente')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

class ClienteController {
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
            const novo = req.body.cliente
           // novo.user_id = decoded.userId
            console.log('cliente novo ', novo)
            const cliente = await Cliente.create(novo)
            console.log('cliente novo 2', cliente)
            return res.status(200).json(cliente)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })


  }

  async listar(req, res) {
    console.log('listar >', Cliente)
    const Clientes = await Cliente.findAll()
    //console.log('Clientes >', Clientes)
    return res.status(200).json(Clientes)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { cliente  } = req.body
      console.log('req.body >> ', req.body)
      const [updated] = await Cliente.update(cliente, {
        where: { id: id },
      })

      if (updated) {
        const updatedConta = await Cliente.findOne({ where: { id: id } })
        return res.status(200).json({ novo: updatedConta })
      }

      throw new Error('Cliente não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const deleted = await Cliente.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        return res.status(200).send({
          message: 'Cliente deletada com sucesso'})
      }
      return res.status(404).send({message: 'Não existe'})
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new ClienteController()
