import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getMessage } from '../services/helloService';
import { success, internalError } from '../utils/response';
import { logger } from '../utils/logger';

export const handler = async (
  _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('hello handler invoked');
    const message = getMessage();
    return success({ message });
  } catch (err) {
    logger.error('hello handler failed', err);
    return internalError();
  }
};
