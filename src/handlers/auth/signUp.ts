import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../../services/cognitoClient';
import { success, badRequest, internalError } from '../../utils/response';
import { logger } from '../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { email, phone_number, password, username, role } = body;
    if (!password) return badRequest('password is required');
    if (!email && !phone_number && !username) return badRequest('email or phone_number or username is required');

    // If creating an admin user, require email
    if (role === 'admin' && !email) return badRequest('email is required for admin users');

    const userPoolId = process.env.USER_POOL_ID as string;
    const name = (email ?? phone_number ?? username) as string;
    const attrs: Array<{ Name: string; Value: string }> = [];
    if (email) attrs.push({ Name: 'email', Value: email });
    if (phone_number) attrs.push({ Name: 'phone_number', Value: phone_number });
    if (role) attrs.push({ Name: 'custom:role', Value: role });

    await cognitoClient.send(new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: name,
      UserAttributes: attrs,
      MessageAction: 'SUPPRESS',
    }));

    await cognitoClient.send(new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: name,
      Password: password,
      Permanent: true,
    }));

    return success({ username: name });
  } catch (err: any) {
    logger.error('signUp failed', err);
    return internalError(err.message ?? 'unknown');
  }
};
