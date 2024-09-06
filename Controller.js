// constantes
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mercadoPago = require('mercadopago')

let app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))  // para trabalhar com requisições post
app.use(bodyParser.json())  // para trabalhar com requisições json

const MELI_TOKEN = process.env.MELI_TOKEN;
const MELI_PUBLIC_KEY = process.env.MELI_PUBLIC_KEY;

const client = new mercadoPago.MercadoPagoConfig({ accessToken: MELI_TOKEN });

// rotas
app.post('/', (req, res) => {
  // console.log(`Com o valor de ${req.body.price} você consegue comprar várias coisas!`)
  console.log(req.body)

  const cardData = new mercadoPago.CardToken({
    cardNumber: '4235647728025682',
    securityCode: '123',
    expirationMonth: '11',
    expirationYear: '2025',
    payment_method_id: 'Visa',
    issuer_id: 25,
    cardholder: {
      name: 'Jorge Luiz',
      identification: {
        type: 'CPF',
        number: '12345678909'
      }
    }
  });

  let cardTokenId = null;
  let tokenCard = new mercadoPago.CardToken(client).create(cardData).then(response => {
    cardTokenId = response.id;
    return cardTokenId; // Este é o token do cartão
  }).catch(error => {
    console.log(error);
  });

  // Função assíncrona para aguardar a resolução da promessa
  async function getCardToken() {
    await tokenCard;
    console.log("Token do cartão:", cardTokenId);

    const paymentData = {
      transaction_amount: 100.00,
      token: cardTokenId,
      description: req.body.description || 'Descrição padrão',
      installments: req.body.installments || 1,
      payment_method_id: 'visa',
      issuer_id: 25,
      payer: {
        email: 'jre-jl@hotmail.com',
        identification: {
          type: 'CPF',
          number: '12345678900'
        }
      }
    };

    const payment = new mercadoPago.Payment(client);
    console.log(payment)
    console.log(paymentData)
    let result = undefined
    payment.create({ body: paymentData })
      .then(response => {
        console.log('Response success: ' + response);
        result = res.status(200).send({'sucesso': true, 'response': response});
      })
      .catch(error => {
        console.log('Response error: ' + JSON.stringify(error));
        result = res.status(500).send({'sucesso': false, 'error': JSON.stringify(error)});
      });
  }

  getCardToken()
})

let port = process.env.PORT || 3000
app.listen(port, (req, res) => {
  console.log(`Servidor rodando na porta: ${port}`)
})
