/**
 * @file Methods related to experience data
 */

 /**
  * Adds a contribution's action totals
  * @param {object} contribution Year contribution object
  * @param {object} totals Stored reference of calculated totals
  * @param {string} type Select value of contribution type
  */
 const addContributionTypeTotal = (contribution, totals, type) => {
  const contributions = _.get(contribution, `${type}.types`)

  if (contributions) {
    contributions.forEach(contributionType => {
      totals[contributionType.name] = totals[contributionType.name] || 0
      totals[contributionType.name] += _.get(contributionType, 'total')
      totals.total += _.get(contributionType, 'total')
    })
  }
 }

/**
 * Calculate an experience's total contributions based on time period and contribution type
 * @param {string} periodIndex Index position of the time period, -1 represents "All Time"
 * @param {number} experienceIndex Index position of the experience
 * @param {string} contributionType Select value of contribution type
 * @return {Object} ret0
 * @return {Number} ret0.totals Grand total of contributions
 * @return {Number} ret0.category<Number> Total contributions of that category type
 */
const getTotalContributions = (periodIndex, experienceIndex, contributionType) => {
  let totals = {
    total: 0
  }
  
  // Check for invalid contribution types
  if (!contributionType) throw new Error('Contribution type not provided!')

  // Check for invalid experience ranges
  if (experienceIndex < 0 && experienceIndex > globalCareer.length - 1) return totals

  // TODO: We may want to store these calculations somewhere...
  // Check for All Time calculation
  if (Number(periodIndex) === -1) {
    const contributions = _.get(globalCareer, `${experienceIndex}.progression.contributions`)

    // Check details for each year and total them
    contributions.forEach(contribution => {
      addContributionTypeTotal(contribution, totals, contributionType)
    })
  } else {
    const contribution = _.get(globalCareer, `${experienceIndex}.progression.contributions.${periodIndex}`)
    addContributionTypeTotal(contribution, totals, contributionType)
  }

  return totals
}

/**
 * Get selected experience tab index
 */
const getExperienceIndex = () => $('#career-tabs .is-active').index()

export {
  getExperienceIndex,
  getTotalContributions
}