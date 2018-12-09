import React from 'react'
import styled from 'styled-components'
import Head from '../components/head'
import Nav from '../components/nav'
import LineCharts from '../components/charts/line_charts'
import API from '../services/api'
import { random_rgba } from '../utils/random_RGBA'
const apisauce = require('apisauce')

let apiBaseUrl = 'http://localhost:3000/'

const api = apisauce.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  // 10 second timeout...
  timeout: 10000
})

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.getMQTT = this.getMQTT.bind(this)
  }

  static async getInitialProps({}) {
    let DB = []
    let colors = {}

    await API.getDB('temperature').then(response => {
      if (response.ok) {
        DB = response.data
        DB.forEach(function(value) {
          if (!colors[value.id]) {
            let color = random_rgba()
            value.color = color
            colors[value.id] = color
          } else {
            value.color = colors[value.id]
          }
        })
      }
    })

    return {
      DB
    }
  }

  state = {
    radio: 'a',
    mqtt: [],
    DB: []
  }

  async getMQTT() {
    let mqtt = []
    await api.get('/mqtt/temperature').then(response => {
      if (response.ok) {
        mqtt = response.data
      }
    })

    this.setState({ mqtt: mqtt })
  }

  componentDidMount() {
    this.interval = setInterval(this.getMQTT, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { radio } = this.state

    let Items = this.props.DB
    if (radio !== 'a') {
      Items = this.state.mqtt
    }

    return (
      <div>
        <Head title="Home" />
        <Nav />
        <label>DB</label>
        <input
          type="radio"
          name="aradio"
          value="A"
          checked={this.state.radio === 'a'}
          onChange={() => this.setState({ radio: 'a' })}
        />
        <br />
        <label>MQTT</label>
        <input
          type="radio"
          name="aradio"
          value="B"
          checked={this.state.radio === 'b'}
          onChange={() => this.setState({ radio: 'b' })}
        />
        <LineCharts Items={Items} />
      </div>
    )
  }
}
