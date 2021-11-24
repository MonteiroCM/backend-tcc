const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET

class AuthController {
  async authenticate(req, res) {
    const { email, password } = req.body

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
      res.status(500).send({
        message: 'Não foi possível fazer o login, cheque seu e-mail e senha',
      })
    }

    const token = jwt.sign({ userId: user[0].id }, JWT_SECRET, {
      expiresIn: '2h',
    })

    return res.status(200).send({
      message: 'Login efetuado com sucesso',
      token,
      user: {
        nome: user[0].nome,
        email: user[0].email,
      },
    })
  }

  async loadSession (req, res) {

    console.log(req.headers)
  
    if(!req.headers.authorization){
      res.status(401).send({ message: 'Sua sessão é inválida ou está expirada' })
      return
    }

    const token = req.headers.authorization.split(' ')[1]


  
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Sua sessão é inválida ou está expirada' })
        return
      }
        if(decoded.userId){
          let recuperado = await User.findByPk(decoded.userId)
          res.status(200).send({ token, user: {
            nome: recuperado.nome,
            email: recuperado.email
          } })
        }
    })
  }

  async validateSession(req, res, next) {
    
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    
    if (!token) {
      res.status(401).send({ message: 'Sua sessão é inválida ou está expirada' })
      return
    }
 

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Sua sessão é inválida ou está expirada' })
      }

      req.data = decoded

      next()
    })
  }
}


module.exports = new AuthController()
