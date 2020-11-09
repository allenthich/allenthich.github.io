/**
 * @file Methods related to an experience's contributions
 */

 /**
 * Contribution type enum
 */
const Contribution = Object.freeze({
  COMMIT: {
    name: "commits",
    verb: "commits contributed",
    displayName: "Commit"
  },
  PULL_REQUEST: {
    name: "pullRequests",
    verb: "pull requests merged",
    displayName: "Pull Request"
  },
  REVIEW: {
    name: "reviews",
    verb: "reviews conducted",
    displayName: "Review"
  },
  LESSON: {
    name: "lessons",
    verb: "educational lessons written",
    displayName: "Lesson"
  },
  ISSUE: {
    name: "issues",
    verb: "issues reported",
    displayName: "Issue"
  },
  PROJECT: {
    name: "projects",
    verb: "projects worked on",
    displayName: "Project"
  }
})

const sortByContribution = () => {
  
}

export {
  Contribution
}