export const handler = async (event: any) => {
  // Minimal DefineAuthChallenge implementation for CUSTOM_AUTH
  const session = event.request.session || [];

  if (session.length === 0) {
    event.response.challengeName = 'CUSTOM_CHALLENGE';
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
  } else {
    const lastChallenge = session[session.length - 1];
    if (lastChallenge && lastChallenge.challengeName === 'CUSTOM_CHALLENGE' && lastChallenge.challengeResult === true) {
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else if (session.length >= 3) {
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    } else {
      event.response.challengeName = 'CUSTOM_CHALLENGE';
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
    }
  }

  return event;
};
