/**
 * Initialize foundation scripts
 */
const initFoundation = () => { $(document).foundation() }

/**
 * Prevent redirect from occurring when the active header is clicked
 */
const preventSameHeaderRedirect = () => {
  $(document).on('click', '.menu a', function (e) {
    if (e.currentTarget != this) return;

    // Check if same page
    if (e.currentTarget.pathname === window.location.pathname)
      e.preventDefault()
  })
}

const setClipboard = text => {
  const tempInput = document.createElement("input");
  tempInput.style = "position: absolute; left: -1000px; top: -1000px";
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

const bindResumeClipboardAction = () => {
  $(document).on('click', '.resume-copy-action', () => {
    setClipboard($('.resume-copy-action').data('clipboard'))
  })
}

const logFriendlyDoge = () => setTimeout(() => {
  console.log(`
  Why hello curious!

    ░░░░░░░▄░░░░░░░░░░░░░░▄░░░░
  ░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░
  ░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░
  ░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐░░░
  ░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░
  ░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░ 
  ░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░
  ░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░
  ░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░
  ░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░
  ▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐░
  ▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌
  ▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░
  ░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░
  ░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░
  ░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░
  ░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░
  ░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░
  ░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░
  `)
}, 5000)

/**
 * Main execution
 */
$(document).ready(() => {
  initFoundation()
  preventSameHeaderRedirect()
  bindResumeClipboardAction()
  logFriendlyDoge()
});
