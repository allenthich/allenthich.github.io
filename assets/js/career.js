import './career/careerApp.js'
import { initBarCharts } from './career/barChart.js'

/**
 * Main execution
 */
$(document).ready(() => {
  // Check for career page
  if (/\/career\//.test(window.location.pathname)) {
    initBarCharts()
  }
});
