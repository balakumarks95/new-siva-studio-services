import { APIGatewayProxyResult } from 'aws-lambda';

const buildResponse = (statusCode: number, body: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

export const success = (data: unknown): APIGatewayProxyResult =>
  buildResponse(200, { success: true, data });

export const created = (data: unknown): APIGatewayProxyResult =>
  buildResponse(201, { success: true, data });

export const badRequest = (message: string): APIGatewayProxyResult =>
  buildResponse(400, { success: false, message });

export const notFound = (message = 'Resource not found'): APIGatewayProxyResult =>
  buildResponse(404, { success: false, message });

export const internalError = (message = 'Internal server error'): APIGatewayProxyResult =>
  buildResponse(500, { success: false, message });
