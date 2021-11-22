const Tamanho = require('../models/Tamanho')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

class TamanhoController {
  async store(req, res) {

    console.log('1')
    if(!req.headers.authorization){
      res.status(400).send({ message: 'Sua sessão é inválida ou está expirada' })
      return
    }
    console.log('2')
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(500).send({ message: 'Sua sessão é inválida ou está expirada' })
        return
      }
      console.log('22')
      console.log('req.body ', req.body)
        if(decoded.userId){
          try {
            const novo = req.body.tamanho
           // novo.user_id = decoded.userId
            console.log('tamanho novo ', novo)
            const tamanho = await Tamanho.create(novo)
            console.log('tamanho novo 2', tamanho)
            return res.status(200).json(tamanho)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })


  }

  async listar(req, res) {
    console.log('listar >', Tamanho)
    const Tamanhos = await Tamanho.findAll()
    //console.log('Tamanhos >', Tamanhos)
    return res.status(200).json(Tamanhos)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { tamanho  } = req.body
      console.log('req.body >> ', req.body)
      const [updated] = await Tamanho.update(tamanho, {
        where: { id: id },
      })

      if (updated) {
        const updatedConta = await Tamanho.findOne({ where: { id: id } })
        return res.status(200).json({ novo: updatedConta })
      }

      throw new Error('Tamanho não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const deleted = await Tamanho.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        return res.status(200).send({
          message: 'Tamanho deletada com sucesso'})
      }
      return res.status(404).send({message: 'Não existe'})
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new TamanhoController()
