// constantes
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

let app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))  // para trabalhar com requisições post
app.use(bodyParser.json())  // para trabalhar com requisições json


// rotas
app.post('/', (req, res) => {
  // console.log(`Com o valor de ${req.body.price} você consegue comprar várias coisas!`)
  console.log(req.body)

  return res.status(200).send({'sucesso': true})
})

let port = process.env.PORT || 3000
app.listen(port, (req, res) => {
  console.log(`Servidor rodando na porta: ${port}`)
})
