/** Shared with the blocking head script and IntroLoader (keep in sync). */
export const INTRO_STORAGE_KEY = 'commit-intro-seen'

/** TEMP: show on every refresh for testing — re-enable session gate before launch */
export const INTRO_ALWAYS_SHOW_FOR_TESTING = true

/** Runs before paint so first-visit pages never flash site content under the intro. */
export const INTRO_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(INTRO_STORAGE_KEY)};var always=${INTRO_ALWAYS_SHOW_FOR_TESTING ? 'true' : 'false'};if(!always&&sessionStorage.getItem(k)==='1'){document.documentElement.classList.add('intro-seen')}else{document.documentElement.classList.add('intro-pending')}}catch(e){document.documentElement.classList.add('intro-pending')}})();`
