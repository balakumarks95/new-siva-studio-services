import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AdminRespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../../services/cognitoClient';
import { success, badRequest, internalError } from '../../utils/response';
import { logger } from '../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username, code, session } = body;
    if (!username || !code) return badRequest('username and code are required');
    const userPoolId = process.env.USER_POOL_ID as string;
    const clientId = process.env.USER_POOL_CLIENT_ID as string;

    const resp = await cognitoClient.send(
      new AdminRespondToAuthChallengeCommand({
        UserPoolId: userPoolId,
        ClientId: clientId,
        ChallengeName: 'CUSTOM_CHALLENGE',
        ChallengeResponses: {
          USERNAME: username,
          ANSWER: code,
        },
        Session: session,
      }),
    );

    return success({ auth: resp.AuthenticationResult });
  } catch (err: any) {
    logger.error('verifyOtp failed', err);
    return internalError(err.message ?? 'unknown');
  }
};
