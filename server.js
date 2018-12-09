const express = require('express')
const next = require('next')
const pathMatch = require('path-match')
const { parse } = require('url')
const path = require('path')
const bodyParser = require('body-parser')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const API = require('./services/api')

const MQTT = require('mqtt')
const client = MQTT.connect({
  host: 'localhost',
  port: 1883,
  clientId: 'mqtt.subscriber'
})

client.on('connect', function() {
  console.log('subscriber.connected.')
})

const messages = {
  temperature: []
}

for (let i = 1; i <= 6; i++) {
  client.subscribe(`temperature${i}`, function() {
    console.log('index.js subscriber.subscribed.')
  })
}

// client.subscribe(`temperature1`, function() {
//   console.log('index.js subscriber.subscribed.')
// })

client.on('message', function(topic, message) {
  let mes = JSON.parse(message)
  const o = Math.round,
    r = Math.random,
    s = 255
  mes.color =
    'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.4 + ')'
  messages.temperature.push(mes)
})

// client.subscribe('temperature1', function() {
//   console.log('subscriber.subscribed.')
// })
// client.on('message', function(topic, message) {
//   console.log(message)
//   if (radio === 'a') {
//     client.end()
//   }
//   this.setState({ mqtt: mqtt })
// })

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  // static files
  server.use(express.static('static'))

  server.get('/', (req, res) => {
    return app.render(req, res, '/index')
  })

  server.get('/mqtt/temperature', (req, res) => {
    res.json(messages.temperature)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
