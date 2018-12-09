import React from 'react'
import { Line } from 'react-chartjs-2'
import { random_rgba } from '../../utils/random_RGBA'

export default class LineCharts extends React.Component {
  getLabelAndDatasetsbyItems = datas => {
    if (!datas) {
      console.error('data not found')
      return false
    }
    let labels = [],
      datasets = [],
      len = 0
    datas.map(function(value) {
      let bool = true
      for (let index = 0; index < datasets.length; index++) {
        let key = datasets[index]
        if (key.label === value.name) {
          key.data.push(value.temperature)
          bool = false
        }
      }
      if (bool) {
        let backgroundColor = value.color
        let obj = {
          label: value.name,
          data: [
            {
              x: Date.now(),
              y: value.temperature
            }
          ],
          backgroundColor: backgroundColor
        }
        datasets.push(obj)
      }
    })
    datasets.map(function(value) {
      if (len < value.data.length) {
        len = value.data.length
      }
    })
    for (let i = 0; i < len; i++) {
      labels.push('p' + i)
    }
    return [labels, datasets]
  }

  render() {
    const { Items } = this.props
    const [labels, datasets] = this.getLabelAndDatasetsbyItems(Items)

    let options = {
      maintainAspectRatio: false,
      responsive: false,
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        ]
      }
    }

    const chartData = {
      labels: labels,
      datasets: datasets
    }

    return <Line data={chartData} options={options} width={1000} height={500} />
  }
}
