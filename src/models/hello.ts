export interface HelloRequest {
  name: string;
  age?: number;
}

export interface HelloResponse {
  message: string;
  code?: number;
}

export type HelloResponseEnvelope = {
  success: true;
  data: HelloResponse;
};

export type ErrorResponseEnvelope = {
  success: false;
  message: string;
};

export type ApiResponse = HelloResponseEnvelope | ErrorResponseEnvelope;
