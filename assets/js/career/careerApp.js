/**
 * @file Getters/Setters for the Career page
 */
import { getTotalContributions } from './experience.js'
import { Contribution } from './contribution.js'
import { updateBarCharts } from './barChart.js'

/**
 * Initialize with first experience content
 */
const CareerApp = new Vue({
  el: '#careerApp',
  delimiters: ["${", "}"], // Resolve syntax {{ }} conflict with Jekyll
  data: {
    experience: _.get(globalCareer, 0),
    experienceIndex: 0,
    timePeriod: -1,
    contributionType: "COMMIT",
    contributionTypes: [],
    contributions: {
      total: 0,
    },
  },
  created () {
    this.getContributionTypes()
    this.updateContributions()
  },
  methods: {
    /**
     * Get the display name of a Contribution type
     * @param {string} type Contribution type
     */
    getContributionTypeDisplayName (type) {
      return _.get(Contribution, `${type}.displayName`)
    },
    /**
     * Retrieves the types of contributions for the current experience across all contributions
     */
    getContributionTypes () {
      const contributions = _.get(this.experience, "progression.contributions")

      // Iterate yearly contributions and aggregate the types
      let contributionTypes = contributions.reduce((accumulator, yearContribution) => _.union(accumulator, Object.keys(yearContribution)), [])

      // Remove year as a type
      this.contributionTypes = _.pull(contributionTypes, 'year')

      // Set the new default "Contributions by..." selected
      this.contributionType = _.head(this.contributionTypes)
    },
    /**
     * Update displayed experience data on new experience tab select
     */
    updateExperienceData (event) {
      const newExperienceIndex = $(event.currentTarget).parent().index()
      this.updateExperienceIndex(newExperienceIndex)
      this.experience = _.get(globalCareer, newExperienceIndex)

      // Get the contribution type for the current experience
      this.getContributionTypes()

      // Update Charts to reflect experience change, set selected tab back to Usage?
      this.updateActivityCharts(null, false)

      this.resetTimePeriod()
    },
    /**
     * Setter for experienceIndex
     * @param {number} newExperienceIndex
     */
    updateExperienceIndex (newExperienceIndex) {
      _.set(this, "experienceIndex", newExperienceIndex)
    },
    /**
     * Set the contributions by the current experience
     */
    updateContributions () {
      this.contributions = getTotalContributions(this.timePeriod, this.experienceIndex, this.contributionType)
    },
    /**
     * Updates Activity bar charts to selected time period and contribution type
     * @param {Boolean} reuseChart Whether a new experience has been selected
     */
    updateActivityCharts (e, reuseChart = true) {
      this.updateContributions()
      updateBarCharts(this.contributions, reuseChart)
    },
    /**
     * Set the dropdown time period to "All Time"
     */
    resetTimePeriod () {
      this.timePeriod = -1
    }
  }
})

export default CareerApp;
