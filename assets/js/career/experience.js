/**
 * @file Methods related to experience data
 */

 /**
  * Adds contribution totals of the breakdown for each contribution type
  * @param {object} contribution Year contribution object
  * @param {object} totals Calculated totals
  * @param {string} contributionType Select value of contribution type
  */
 const addContributionTotal = (contribution, totals, contributionType) => {
  const contributionBreakdown = _.get(contribution, `${contributionType}.types`)

  if (contributionBreakdown) {
    contributionBreakdown.forEach(detailType => {
      totals[detailType.name] += _.get(detailType, 'total')
    })
    totals.total +=_.get(contribution, `${contributionType}.total`)
  }
 }

/**
 * Calculate an experience's total contributions based on time period and contribution type
 * @param {string} periodIndex Index position of the time period, -1 represents "All Time"
 * @param {number} experienceIndex Index position of the experience
 * @param {string} contributionType Select value of contribution type
 */
const getTotalContributions = (periodIndex, experienceIndex, contributionType) => {
  let totals = {
    testing: 0,
    site: 0,
    email: 0,
    total: 0
  }

  // Check for invalid contribution types
  if (!contributionType) return totals

  // Check for invalid experience ranges
  if (experienceIndex < 0 && experienceIndex > globalCareer.length - 1) return totals

  // TODO: We may want to store these calculations somewhere...
  // Check for All Time calculation
  if (Number(periodIndex) === -1) {
    const contributions = _.get(globalCareer, `${experienceIndex}.progression.statistics`)

    // Check details for each year and total them
    contributions.forEach(contribution => {
      addContributionTotal(contribution, totals, contributionType)
    })
  } else {
    const contribution = _.get(globalCareer, `${experienceIndex}.progression.statistics.${periodIndex}`)
    addContributionTotal(contribution, totals, contributionType)
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