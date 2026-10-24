// Turns an axios failure into something a user can act on.
//
// Previously each screen kept its own copy of this and fell back to
// error.message, which for a 5xx is axios's raw "Request failed with status
// code 502" — it reads like the form was rejected when the server is simply
// down, and testers reported it as a Create Account bug.

const GENERIC = 'Something went wrong. Please try again.';

const BY_STATUS = {
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  408: 'That took too long. Please try again.',
  413: 'That file is too large. Please choose a smaller one.',
  429: 'Too many attempts. Please wait a moment and try again.',
};

const SERVER_DOWN =
  'EzanExpress is temporarily unavailable. This is a problem on our side, ' +
  'not with your details. Please try again in a few minutes.';

export const getBackendError = error => {
  // A message the API deliberately sent us is always the most useful thing.
  // The API is inconsistent about which key it uses, so check all three.
  const data = error?.response?.data;
  const serverMessage = data?.error || data?.message || data?.msg;

  if (typeof serverMessage === 'string' && serverMessage.trim()) {
    return serverMessage;
  }

  if (error?.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your connection and try again.';
  }

  // No response at all: offline, DNS failure, TLS failure.
  if (!error?.response) {
    return 'Unable to reach EzanExpress. Please check your connection and try again.';
  }

  const status = error.response.status;

  // 502/503/504 come from nginx as an HTML error page, so there is no JSON
  // message to read. Never show the user a status code for these.
  if (status >= 500) {
    return SERVER_DOWN;
  }

  return BY_STATUS[status] || GENERIC;
};

export default getBackendError;
