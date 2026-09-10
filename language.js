/* Pull Language from URL */
const langs = new Set(['en', 'zh']);
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  if (langs.has(lang)) {
    document.documentElement.lang = lang;
  }
};

/* Button Presses */
document.addEventListener('click', function(event) {

  /* Language Button */
  if (event.target.classList.contains('lang-content')) {
    const lang = event.target.getAttribute('lang');
    if (langs.has(lang)) {
      document.documentElement.lang = lang;
    }
  }
});