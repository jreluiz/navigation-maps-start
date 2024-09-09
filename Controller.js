// constantes
require('dotenv').config();
const Stripe = require('stripe');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

let app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))  // para trabalhar com requisições post
app.use(bodyParser.json())  // para trabalhar com requisições json

// Configurar Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
})

// rotas
app.post('/payment-intent', async (req, res) => {
  console.log(req.body);
  try {
    const { amount } = req.body

    // Criação do PaymentIntent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    // Retorna o clientSecret ao frontend
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

let port = process.env.PORT || 3000
app.listen(port, (req, res) => {
  console.log(`Servidor rodando na porta: ${port}`)
})
