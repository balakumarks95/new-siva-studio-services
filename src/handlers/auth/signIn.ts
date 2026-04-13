import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AdminInitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../../services/cognitoClient';
import { success, badRequest, internalError } from '../../utils/response';
import { logger } from '../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username, password } = body;
    if (!username || !password) return badRequest('username and password required');
    const userPoolId = process.env.USER_POOL_ID as string;
    const clientId = process.env.USER_POOL_CLIENT_ID as string;

    const resp = await cognitoClient.send(
      new AdminInitiateAuthCommand({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }),
    );

    return success({ auth: resp.AuthenticationResult });
  } catch (err: any) {
    logger.error('signIn failed', err);
    return internalError(err.message ?? 'unknown');
  }
};
