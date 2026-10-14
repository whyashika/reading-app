/**
 * App-wide settings. Change the name here and it updates everywhere:
 * the nav bar, the browser tab title and the installable (PWA) app name.
 */
export const APP_NAME = "Infolio";

/** A one-line description, used in the install manifest and the page's meta tags. */
export const APP_TAGLINE = "Hard ideas, told simply, by a fellow learner.";

/** Short name shown under the icon on a phone's home screen (keep it under ~12 characters). */
export const APP_SHORT_NAME = APP_NAME.length <= 12 ? APP_NAME : APP_NAME.slice(0, 12);

/** Average adult reading speed, used to estimate reading time when a piece doesn't set one. */
export const WORDS_PER_MINUTE = 220;

/** An unopened piece counts as "New" if it was published within this many days (or since the reader's last visit). */
export const NEW_PIECE_DAYS = 30;
