const Categoria = require('../models/Categoria')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

class CategoriaController {
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
            const novo = req.body.categoria
           // novo.user_id = decoded.userId
            console.log('categoria novo ', novo)
            const categoria = await Categoria.create(novo)
            console.log('categoria novo 2', categoria)
            return res.status(200).json(categoria)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })

  
  }

  async listar(req, res) {
    const Categorias = await Categoria.findAll({})

    return res.status(200).json(Categorias)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { categoria  } = req.body
      console.log('req.body >> ', req.body)
      const [updated] = await Categoria.update(categoria, {
        where: { id: id },
      })

      if (updated) {
        const updatedConta = await Categoria.findOne({ where: { id: id } })
        return res.status(200).json({ novo: updatedConta })
      }

      throw new Error('Categoria não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const deleted = await Categoria.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        return res.status(200).send({
          message: 'Categoria deletada com sucesso'})
      }
      return res.status(404).send({message: 'Não existe'})
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new CategoriaController()
