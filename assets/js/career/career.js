/**
 * @file Getters/Setters for the Career page
 */
import { getTotalContributions } from './experience.js'
import { updateBarCharts } from './barChart.js'

/**
 * Contribution type enum
 */
const Contribution = Object.freeze({
  COMMIT: "commits",
  PULL_REQUEST: "pullRequests",
  REVIEW: "reviews"
})

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
    contributionType: Contribution.COMMIT,
    contributions: {
      total: 0,
      testing: 0,
      site: 0,
      email: 0
    },
    contributionText: '',
    contributionEnum: Contribution
  },
  created () {
    this.updateContributions()
    this.setContributionText()
  },
  methods: {
    setContributionText () {
      const contributionType = _.get(this, 'contributionType')
      const totalContributions = _.get(this, 'contributions.total')

      if (contributionType === Contribution.COMMIT) {
        this.contributionText = totalContributions + " commits contributed"
      } else if (contributionType === Contribution.PULL_REQUEST) {
        this.contributionText = totalContributions + " pull requests merged"
      } else if (contributionType === Contribution.REVIEW) {
        this.contributionText = totalContributions + " reviews conducted"
      }
    },
    /**
     * Update displayed experience data on new experience tab select
     */
    updateExperienceData (event) {
      const newExperienceIndex = $(event.currentTarget).parent().index()
      this.updateExperienceIndex(newExperienceIndex)
      this.experience = _.get(globalCareer, newExperienceIndex)

      // Update Charts to reflect experience change, set selected tab back to Usage?
      this.updateActivityCharts()
    },
    /**
     * Setter for experienceIndex
     * @param {number} newExperienceIndex
     */
    updateExperienceIndex (newExperienceIndex) {
      _.set(this, "experienceIndex", newExperienceIndex)
    },
    getTotalContributions () {
      return getTotalContributions(this.timePeriod, this.experienceIndex, this.contributionType)
    },
    updateContributions () {
      const contributions = this.getTotalContributions()
      this.contributions = contributions
    },
    /**
     * Updates Activity bar charts to selected time period and contribution type
     */
    updateActivityCharts () {
      this.updateContributions()
      updateBarCharts(this.contributions)
      this.setContributionText()
    }
  }
})

export default CareerApp;
