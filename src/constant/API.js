

const DEV_API_URI = 'http://localhost:6312/api';

const PROD_API_URI =
  'https://api.threadique.live/api';

export const BASE_API_URI = __DEV__ ? DEV_API_URI : PROD_API_URI;



// Address lookup is proxied through our backend at /address/autocomplete so
// the Geoapify key is never shipped inside the app bundle.
      
export const TERMS_URL = 'https://sarmadcodes.github.io/ezanexpress-privacynterms/terms/';

export const PRIVACY_URL = 'https://sarmadcodes.github.io/ezanexpress-privacynterms/privacy/';

export const SUPPORT_EMAIL = 'ezanexpress@gmail.com';

export const SUPPORT_URL = 'https://sarmadcodes.github.io/ezanexpress-privacynterms/support/';
