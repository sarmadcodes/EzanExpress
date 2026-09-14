

const DEV_API_URI = 'http://localhost:6312/api';

const PROD_API_URI =
  'https://api.threadique.live/api';

export const BASE_API_URI = __DEV__ ? DEV_API_URI : PROD_API_URI;


export const GEOAPIFY_API_KEY = '7d5d96089c764dd6a2492ae47d30511f';
