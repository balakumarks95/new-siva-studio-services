const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const config = {
  stage: getEnv('STAGE', 'dev'),
  awsRegion: getEnv('AWS_REGION', 'ap-south-1'),
  serviceName: getEnv('SERVICE_NAME', 'new-siva-studio-services'),
} as const;

export default config;
