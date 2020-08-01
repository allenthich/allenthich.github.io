/**
 * @file Methods related to bar charts displayed on "Activity" tab
 * Charts built by Chart.js
 */
import { getTotalContributions } from './experience.js'

/**
 * References to Chart objects
 */
let chartReferences = {
  activityChart1: null,
  activityChart2: null,
  activityChart3: null,
}

const addData = (chart, label, data) => {
  chart.data.labels.push(label)
  chart.data.datasets[0].data.push(data)
}

const removeData = chart => {
  chart.data.labels.pop()
  chart.data.datasets[0].data = []
}

const updateBarChart = ({ title, index, total, totalMax }) => {
  let chart = _.get(chartReferences, `activityChart${index}`)
  removeData(chart)
  addData(chart, title, total)
  _.set(chart, `options.scales.yAxes.0.ticks.max`, totalMax + 2)
  chart.update()
}

/**
 * Updates a single Bar Chart given data
 */
const initBarChart = ({ title, index, total, totalMax }) => {
  const $ctx = $(`#activityChart${index}`)
  chartReferences[`activityChart${index}`] = new Chart($ctx, {
    type: 'bar',
    data: {
        labels: [title],
        datasets: [{
            label: '',
            data: [total],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
            categoryPercentage: 1.0,
            barPercentage: 1.0
        }]
    },
    options: {
      layout: {
        padding: {
            left: -10,
            bottom: -10
        }
      },
      legend: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: 'rgba(255, 99, 132, 0.2)'
          },
          ticks: {
            display: false,
            beginAtZero: true
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            min: 0,
            max: totalMax + 2,
            display: false,
            beginAtZero: true
          }
        }]
      }
    }
  })
}

/**
 * Initializes all bar charts for the first active experience
 */
const initBarCharts = () => {
  const contributionType = $('#contribution-select option:first-child').val()
  const totals = getTotalContributions(-1, 0, contributionType)
  const totalContributions = [
    {
      title: `AB Testing`,
      total: totals.testing
    },
    {
      title: `Site Content`,
      total: totals.site
    },
    {
      title: `Email Content`,
      total: totals.email
    }
  ]
  const totalMax = totals.total
  totalContributions.forEach((contribution, index) => {
    initBarChart({...contribution, index, totalMax})
  })
}

/**
 *
 */
// const updateBarCharts = (periodIndex, experienceIndex, contributionType) => {
//   const totals = getTotalContributions(periodIndex, experienceIndex, contributionType)
//   const totalContributions = [
//     {
//       title: `AB Testing`,
//       total: totals.testing
//     },
//     {
//       title: `Site Content`,
//       total: totals.site
//     },
//     {
//       title: `Email Content`,
//       total: totals.email
//     }
//   ]
//   const totalMax = totals.total
//   totalContributions.forEach((contribution, index) => {
//     updateBarChart({...contribution, index, totalMax})
//   })
//   return totalContributions
// }
/**
 *
 */
const updateBarCharts = (contributions) => {
  const totalContributions = [
    {
      title: `AB Testing`,
      total: contributions.testing
    },
    {
      title: `Site Content`,
      total: contributions.site
    },
    {
      title: `Email Content`,
      total: contributions.email
    }
  ]
  const totalMax = contributions.total
  totalContributions.forEach((contribution, index) => {
    updateBarChart({...contribution, index, totalMax})
  })
}

export {
  initBarCharts,
  updateBarCharts
}