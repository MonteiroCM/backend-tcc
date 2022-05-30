const Produto = require('../models/Produtos')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const databaseConfig = require('../../config/database')
const { Sequelize, Model } = require('sequelize')

const JWT_SECRET = process.env.JWT_SECRET

class ProdutoController {
  async store(req, res) {
    if (!req.headers.authorization) {
      res
        .status(400)
        .send({ message: 'Sua sessão é inválida ou está expirada' })
      return
    }

    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        res
          .status(500)
          .send({ message: 'Sua sessão é inválida ou está expirada' })
        return
      }

      if (decoded.userId) {
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

  async estatistica(req, res) {
    const { codigo } = req.params
    const { filtro } = req.body
    //console.log('body > ', filtro, codigo)
var resultado = []
    const sequelize = new Sequelize(databaseConfig)
    if (codigo == 0) {
      const [results, metadata] = await sequelize.query(
        `SELECT sum(produtos) as produtos, sum(usuarios) as usuarios, sum(pedidos) as pedidos, sum(pedido_dia) as pedido_dia FROM
          (
          select count(*) as produtos, 0 as usuarios, 0 as pedidos, 0 as pedido_dia from produtos
          UNION ALL
          select 0 as produtos, count(*) as usuarios, 0 as pedidos, 0 as pedido_dia from users
          UNION ALL
          select 0 as produtos, 0 as usuarios, count(*) as pedidos, 0 as pedido_dia from pedidos
          UNION ALL
          select 0 as produtos, 0 as usuarios, 0 as pedidos, count(*) as pedido_dia from pedidos where data_pedido::date = now()::date
          ) as tab`,
        { raw: true }
      )

      var valores = Object.entries(results[0])


      console.log('valores', valores)

      valores.forEach((element, key) => {
        resultado.push({
          title: element[0],
          total: element[1],
        })
      })

      return res.status(200).json(resultado)
    }

    if (codigo == 1) {
      const [results, metadata] = await sequelize.query(
        `SELECT ano,
        coalesce(sum(jan),0) as jan,
        coalesce(sum(fev),0) as fev,
        coalesce(sum(mar),0) as mar,
        coalesce(sum(abr),0) as abr,
        coalesce(sum(mai),0) as mai,
        coalesce(sum(jun),0) as jun,
        coalesce(sum(jul),0) as jul,
        coalesce(sum(ago),0) as ago,
        coalesce(sum(set),0) as set,
        coalesce(sum(out),0) as out,
        coalesce(sum(nov),0) as nov,
        coalesce(sum(dez),0) as dez FROM CROSSTAB(
          'select date_part(''year'', data_pedido),date_part(''month'', data_pedido) as mes,count(id) as total
            from pedidos
            group by date_part(''year'', data_pedido),date_part(''month'', data_pedido)',
          'select generate_series(1,12)'
        ) AS t (
          ano INT,
          jan FLOAT,
          fev FLOAT,
          mar FLOAT,
          abr FLOAT,
          mai FLOAT,
          jun FLOAT,
          jul FLOAT,
          ago FLOAT,
          set FLOAT,
          out FLOAT,
          nov FLOAT,
          dez FLOAT
        ) GROUP BY ano`,
        { raw: true }
      )

      var valores = Object.entries(results[0])


      console.log('valores', results)

      results.forEach((element, key) => {
        //console.log('element > key = ', element.ano, key)
        resultado.push({
          name: element.ano,
          data: [element.jan, element.fev, element.mar, element.abr, element.mai, element.jun, element.jul, element.ago, element.set, element.out, element.nov,  element.dez ],
        })
      })

      return res.status(200).json(resultado)
    }

    if (codigo == 3) {
      const [results, metadata] = await sequelize.query(
        `with produtos_nome as (
          SELECT nome FROM produtos ORDER BY produtos.nome
        ), itens as (
        SELECT produtos.nome, SUM(valor) AS valor,SUM(quantidade) AS quantidade FROM pedido_itens
                INNER JOIN produtos ON produtos.id = pedido_itens.produto_id
                INNER JOIN pedidos ON pedidos.id  = pedido_itens.pedido_id
               WHERE date_part('month', data_pedido) = ${filtro.mes} AND date_part('year', data_pedido) = ${filtro.ano}
                GROUP BY produtos.nome, date_part('month', data_pedido), date_part('year', data_pedido)
            ORDER BY produtos.nome
          )
          select produtos_nome.nome,coalesce(itens.valor,0) as valor,coalesce(itens.quantidade,0) as quantidade FROM itens
          FULL JOIN produtos_nome ON produtos_nome.nome = itens.nome`,
        { raw: true }
      )
      var nomes = []
      var valor = []
      var quantidade = []

      if(results.length == 0){
        resultado.push({
          nomes,
          valor,
          quantidade,
        })
        return res.status(200).json(resultado)
      }

      var valores = Object.entries(results[0])


      console.log('valores', valores)

      results.forEach((element, key) => {
        nomes.push(element.nome)
        valor.push(parseFloat(element.valor))
        quantidade.push(parseInt(element.quantidade, 10))
      })




      resultado.push({
        nomes,
        valor,
        quantidade,
      })

      return res.status(200).json(resultado)
    }

    if (codigo == 4) {
      const [results, metadata] = await sequelize.query(
        ` SELECT ano,
        coalesce(sum(jan),0) as jan,
        coalesce(sum(fev),0) as fev,
        coalesce(sum(mar),0) as mar,
        coalesce(sum(abr),0) as abr,
        coalesce(sum(mai),0) as mai,
        coalesce(sum(jun),0) as jun,
        coalesce(sum(jul),0) as jul,
        coalesce(sum(ago),0) as ago,
        coalesce(sum(set),0) as set,
        coalesce(sum(out),0) as out,
        coalesce(sum(nov),0) as nov,
        coalesce(sum(dez),0) as dez FROM CROSSTAB(
          'select date_part(''year'', data_pedido),date_part(''month'', data_pedido) as mes,sum(pedido_itens.valor) as total
            from pedidos
			inner join pedido_itens on pedido_itens.pedido_id = pedidos.id
            group by date_part(''year'', data_pedido),date_part(''month'', data_pedido)',
          'select generate_series(1,12)'
        ) AS t (
          ano INT,
          jan FLOAT,
          fev FLOAT,
          mar FLOAT,
          abr FLOAT,
          mai FLOAT,
          jun FLOAT,
          jul FLOAT,
          ago FLOAT,
          set FLOAT,
          out FLOAT,
          nov FLOAT,
          dez FLOAT
        )
		GROUP BY ano`,
        { raw: true }
      )

      var valores = Object.entries(results[0])


      console.log('valores', results)

      results.forEach((element, key) => {
        //console.log('element > key = ', element.ano, key)
        resultado.push({
          name: element.ano,
          data: [element.jan, element.fev, element.mar, element.abr, element.mai, element.jun, element.jul, element.ago, element.set, element.out, element.nov,  element.dez ],
        })
      })

      return res.status(200).json(resultado)
    }

    if(codigo == 5){
      const [results, metadata] = await sequelize.query(
        `with produtos_nome as (
          SELECT distinct formapagamento as nome FROM pedido_itens WHERE formapagamento IS NOT NULL ORDER BY formapagamento
        ), itens as (
        SELECT pedido_itens.formapagamento as nome, SUM(valor) AS valor,SUM(quantidade) AS quantidade FROM pedido_itens
			INNER JOIN pedidos ON pedidos.id  = pedido_itens.pedido_id
               WHERE date_part('month', data_pedido) = ${filtro.mes} AND date_part('year', data_pedido) = ${filtro.ano}
                GROUP BY pedido_itens.formapagamento, date_part('month', data_pedido), date_part('year', data_pedido)
            ORDER BY pedido_itens.formapagamento
          )
          select coalesce(produtos_nome.nome, 'SEM DEFINIÇÂO') as nome,coalesce(itens.valor,0) as valor,coalesce(itens.quantidade,0) as quantidade FROM itens
          FULL JOIN produtos_nome ON produtos_nome.nome = itens.nome`,
        { raw: true }
      )
      var nomes = []
      var valor = []
      var quantidade = []

      if(results.length == 0){
        resultado.push({
          nomes,
          valor,
          quantidade,
        })
        return res.status(200).json(resultado)
      }

      var valores = Object.entries(results[0])


      console.log('valores', valores)

      results.forEach((element, key) => {
        nomes.push(element.nome)
        valor.push(parseFloat(element.valor))
        quantidade.push(parseInt(element.quantidade, 10))
      })




      resultado.push({
        nomes,
        valor,
        quantidade,
      })

      return res.status(200).json(resultado)
    }

    if(codigo == 6){
      const [results, metadata] = await sequelize.query(
        `SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS sequencia, nome, total
        FROM (
        SELECT users.nome,SUM(valor) AS total FROM pedido_itens
        INNER JOIN pedidos ON pedidos.id = pedido_itens.pedido_id
        INNER JOIN users ON users.id = pedidos.user_id
        GROUP BY users.nome
        ORDER BY total DESC
        LIMIT 10
          ) as tab
          ORDER BY total DESC
          `,
        { raw: true }
      )

      var valores = Object.entries(results[0])

      console.log('valores', results)

      return res.status(200).json(results)
    }

    return res.status(200).json(results)
  }

  async listar(req, res) {
    const Produtos = await Produto.findAll({
      include: [{ attributes: ['id', 'nome'], association: 'categorias' }],
    })

    return res.status(200).json(Produtos)
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { produto } = req.body
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
      return res.status(500).send({ message: error.message })
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
          message: 'Produto deletada com sucesso',
        })
      }
      throw new Error('Produto não existe')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new ProdutoController()
