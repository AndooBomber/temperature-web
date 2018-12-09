'use strict'

const apisauce = require('apisauce')
const base64 = require('base-64')
const URI = require('urijs')
const dev = process.env.NODE_ENV !== 'production'

let apiBaseUrl = 'http://localhost:8080/'
// if (dev) {
//   apiBaseUrl = "http://localhost:8080/"
// }

const api = apisauce.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  // 10 second timeout...
  timeout: 10000
})

const getDB = title => {
  return api.get(`/data/${title}`)
}

const getMQTT = title => {
  const mqtt = require('mqtt')
  const client = mqtt.connect({
    host: 'localhost',
    port: 1883,
    clientId: 'mqtt.subscriber'
  })

  client.on('connect', function() {
    client.subscribe(`${title}`)
  })

  return client
}

module.exports = { getDB, getMQTT }
