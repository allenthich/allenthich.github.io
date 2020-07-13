/**
 * Initialize foundation scripts
 */
const initFoundation = () => {
  $(document).foundation()
}

/**
 * Prevents redirect from occurring when the active header is clicked
 */
const preventSameHeaderRedirect = () => {
  $(document).on('click', '.menu a', function (e) {
    if (e.currentTarget != this) return;

    // Check if same page
    if (e.currentTarget.pathname === window.location.pathname) {
      e.preventDefault()
    }
  })
}

/**
 * Main execution
 */
$(document).ready(() => {
  initFoundation()
  preventSameHeaderRedirect()
});