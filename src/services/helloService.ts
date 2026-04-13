import config from '../config';

export const getMessage = (): string => {
  return `Hello from ${config.serviceName} running on stage: ${config.stage}`;
};
