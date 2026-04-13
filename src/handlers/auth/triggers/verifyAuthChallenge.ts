export const handler = async (event: any) => {
  // VerifyAuthChallenge: compare provided answer with privateChallengeParameters.answer
  const expected = event.request.privateChallengeParameters?.answer;
  const provided = event.request.challengeAnswer;

  event.response.answerCorrect = provided && expected && provided === expected;

  return event;
};
