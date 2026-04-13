import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { SNSClient } from "@aws-sdk/client-sns";
import { SESClient } from "@aws-sdk/client-ses";
import config from "../config";

export const cognitoClient = new CognitoIdentityProviderClient({ region: config.awsRegion });
export const snsClient = new SNSClient({ region: config.awsRegion });
export const sesClient = new SESClient({ region: config.awsRegion });

export default { cognitoClient, snsClient, sesClient };