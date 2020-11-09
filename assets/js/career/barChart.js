/**
 * @file Methods related to bar charts displayed on "Activity" tab
 * Charts built by Chart.js
 */
import { getTotalContributions } from './experience.js'

/**
 * References to Chart objects
 */
let chartReferences = {
  activityChart0: null,
  activityChart1: null,
  activityChart2: null,
  activityChart3: null,
}

/**
 * Set chart's bar value
 * @param {*} chart Chart reference
 * @param {*} label Name of hover label
 * @param {*} data Bar value
 */
const addData = (chart, label, data) => {
  chart.data.labels.push(label)
  chart.data.datasets[0].data.push(data)
}

/**
 * Remove chart's bar value
 * @param {*} chart Chart reference
 */
const removeData = chart => {
  chart.data.labels.pop()
  chart.data.datasets[0].data = []
}

/**
 * Update an individual bar chart with a new bar value
 * @param {Object} dataObject
 * @param {String} title
 * @param {Number} index
 * @param {Number} total
 * @param {Number} totalMax
 * @param {Boolean} isNewExperience Whether a new experience has been selected
 */
const updateBarChart = ({ title, index, total, totalMax, reuseChart }) => {
  // Wait for Vue to rerender canvas element
  const checkCanvasInterval = setInterval(() => {
    if ($(`#activityChart${index}`).length !== 0) {
      if (!reuseChart) {
        // Destroy existing Chart reference
        destroyChart(index)

        // Reinitialize Chart
        initBarChart({ title, index, total, totalMax })
      } else {
        // Reuse chart
        let chart = _.get(chartReferences, `activityChart${index}`)
        removeData(chart)
        addData(chart, title, total)
        _.set(chart, `options.scales.yAxes.0.ticks.max`, totalMax + 2)
        chart.update()
      }
      clearInterval(checkCanvasInterval)
    }
  }, 50)
}

/**
 * Clean up chart reference
 * @param {Number} index Index of chart reference
 */
const destroyChart = index => {
  let chart = chartReferences[`activityChart${index}`]
  if (chart) {
    chart.reset()
    chart.destroy()
  }
  chartReferences[`activityChart${index}`] = null
}

/**
 * Initializes a single Bar Chart given data
 */
const initBarChart = ({ title, index, total, totalMax }) => {
  // Don't initialize for overall 'total' count
  if (title === 'total') return
  chartReferences[`activityChart${index}`] = new Chart(`activityChart${index}`, {
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
      tooltips: {
        // Disable the on-canvas tooltip
        enabled: false,

        custom: function(tooltipModel) {
          // Tooltip Element
          var tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
          }

          // Set caret Position
          tooltipEl.classList.remove('above', 'below', 'no-transform');
          if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
              tooltipEl.classList.add('no-transform');
          }

          function getBody(bodyItem) {
              return bodyItem.lines;
          }

          // Set Text
          if (tooltipModel.body) {
              var titleLines = tooltipModel.title || [];
              var bodyLines = tooltipModel.body.map(getBody);

              var innerHtml = '<thead>';

              titleLines.forEach(function(title) {
                  innerHtml += '<tr><th>' + title + '</th></tr>';
              });
              innerHtml += '</thead><tbody>';

              bodyLines.forEach(function(body, i) {
                  var colors = tooltipModel.labelColors[i];
                  var style = 'background:' + colors.backgroundColor;
                  style += '; border-color:' + colors.borderColor;
                  style += '; border-width: 2px';
                  var span = '<span style="' + style + '"></span>';
                  innerHtml += '<tr><td>' + span + body + '</td></tr>';
              });
              innerHtml += '</tbody>';

              var tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
          }

          // `this` will be the overall tooltip
          var position = this._chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
          tooltipEl.style.pointerEvents = 'none';
        }
      },
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

  // Return reference in case of use
  return chartReferences[`activityChart${index}`]
}

/**
 * Pass each contribution total into a processor function
 * @param {Object} totals
 * @param {Number} totals.total Grand total of all contributions
 * @param {Number} totals.type<String> Total contributions of that contribution type
 * @param {function} contributionProcessor Function to apply for each contribution total
 */
const processContributions = (totals, contributionProcessor) => {
  const totalMax = totals.total || 0

  // Remove flag
  const reuseChart = totals.reuseChart
  delete totals.reuseChart

  let sortedKeys = Object.keys(totals).sort()
  sortedKeys.forEach((key, index) => {
    contributionProcessor({ title: key, total: totals[key], index, totalMax, reuseChart })
  })
}

/**
 * Initializes all bar charts for the first active experience
 */
const initBarCharts = () => {
  // Set the default
  const contributionAction = $('#contribution-select option:first-child').val()
  const totals = getTotalContributions(-1, 0, contributionAction)
  processContributions({ ...totals, reuseChart: true }, initBarChart)
}

/**
 * Update all bar chart values
 * @param {*} totals 
 */
const updateBarCharts = (totals, reuseChart = true) => {
  processContributions({ ...totals, reuseChart }, updateBarChart)
}

export {
  initBarCharts,
  updateBarCharts
}