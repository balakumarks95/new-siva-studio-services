import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../../src/handlers/hello';
import * as helloService from '../../../src/services/helloService';

jest.mock('../../../src/services/helloService');

const mockGetMessage = helloService.getMessage as jest.MockedFunction<typeof helloService.getMessage>;

const buildEvent = (overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent =>
  ({
    httpMethod: 'GET',
    path: '/',
    headers: {},
    queryStringParameters: null,
    body: null,
    pathParameters: null,
    ...overrides,
  } as APIGatewayProxyEvent);

describe('hello handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with message on success', async () => {
    mockGetMessage.mockReturnValue('Hello from test');

    const result = await handler(buildEvent());

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.message).toBe('Hello from test');
  });

  it('returns 500 when service throws', async () => {
    mockGetMessage.mockImplementation(() => {
      throw new Error('unexpected error');
    });

    const result = await handler(buildEvent());

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
  });
});
