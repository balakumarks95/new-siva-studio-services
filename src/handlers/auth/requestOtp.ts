import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AdminInitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../../services/cognitoClient';
import { success, badRequest, internalError } from '../../utils/response';
import { logger } from '../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username } = body;
    if (!username) return badRequest('username is required');
    const userPoolId = process.env.USER_POOL_ID as string;
    const clientId = process.env.USER_POOL_CLIENT_ID as string;

    const resp = await cognitoClient.send(
      new AdminInitiateAuthCommand({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'CUSTOM_AUTH',
        AuthParameters: {
          USERNAME: username,
        },
      }),
    );

    // resp.Session must be passed back by the client to complete the challenge
    return success({ challenge: resp.ChallengeName, session: resp.Session });
  } catch (err: any) {
    logger.error('requestOtp failed', err);
    return internalError(err.message ?? 'unknown');
  }
};
