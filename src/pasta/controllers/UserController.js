const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Endereco = require('../models/Endereco')

const JWT_SECRET = process.env.JWT_SECRET

class UserController {
  async listar(req, res) {
    const users = await User.findAll()
    return res.status(200).json(users)
  }

  async listarCliente(req, res) {
    const users = await User.findAll({
      attributes: ['id','nome', 'email'],
    })
    return res.status(200).json(users)
  }

  async store(req, res) {
    console.log('req.body', req.body)
    const { nome, email, password } = req.body
    console.log(nome, email, password)
    const passwordCody = await bcrypt.hash(password, 10)
    const user = await User.create({
        nome,
        email,
        password: passwordCody
    })
    return res.status(200).json(user)
  }

  async storeEndereco(req, res) {

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
            const novo = req.body.endereco
            console.log('storeEndereco ', req.body)
            novo.user_id = decoded.userId


            const endereco = await Endereco.create(novo)
            return res.status(200).json(endereco)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })
  }

  async updateEndereco(req, res) {
    try {
      const { id } = req.params
      const { endereco  } = req.body
      console.log('req.body >> ', req.body)
      const [updated] = await Endereco.update(endereco, {
        where: { id: id },
      })

      if (updated) {
        const updatedConta = await Endereco.findOne({ where: { id: id } })
        return res.status(200).json({ endereco: updatedConta })
      }

      throw new Error('Endereco não Encontrado')
    } catch (error) {
      return res.status(500).send({message: error.message})
    }
  }

  async listarEndereco(req, res) {

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

            const enderecos = await Endereco.findAll({ where: { user_id: decoded.userId } })
            return res.status(200).json(enderecos)
          } catch (error) {
            console.log(error)
            return res.status(401).json(error.message || error)
          }
        }
    })
  }

  async deleteEndereco(req, res) {
    try {
      const { id } = req.params
      const deleted = await Endereco.destroy({
        where: {
          id: id,
        },
      })

      if (deleted) {
        return res.status(200).send({
          message: 'Endereco deletada com sucesso'})
      }
      return res.status(404).send({message: 'Não existe'})
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async login(req, res) {
    const { email, password } = req.body

    try {
      const user = await User.findAll({
        raw: true,
        where: {
          email: email,
        },
      })

      if (!user || user.length == 0) {
        return res.status(401).send({
          error: '401 - Unauthorized',
        })
      }

      const valid = await bcrypt.compare(password, user[0].password)
      if (!valid) {
        return res.status(401).send({
          error: '401 - Unauthorized',
        })
      }
      const token = jwt.sign(
        {
          userId: user[0].id,
        },
        JWT_SECRET,
        {
          expiresIn: '2h',
        }
      )

      delete user[0].password

      return res.status(200).json({
        token,
        user: {
          nome: user[0].nome,
          email: user[0].email,
          id: user[0].id,
          tipo: user[0].tipo,
        },
      })
    } catch (error) {
       console.log('login',error)
    }
  }
}

module.exports = new UserController()
