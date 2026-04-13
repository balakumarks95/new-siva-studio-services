import { snsClient, sesClient } from '../../../services/cognitoClient';
import { PublishCommand } from '@aws-sdk/client-sns';
import { SendEmailCommand } from '@aws-sdk/client-ses';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const handler = async (event: any) => {
  // CreateAuthChallenge: generate OTP and send via SMS/Email when available
  const otp = generateOtp();

  // publicChallengeParameters are visible to the client (avoid secrets there)
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes?.email,
    phone_number: event.request.userAttributes?.phone_number,
  };

  // privateChallengeParameters are kept server-side and passed to Verify
  event.response.privateChallengeParameters = { answer: otp };
  event.response.challengeMetadata = `OTP_${Date.now()}`;

  // Send via SNS (SMS) if phone number present
  try {
    const phone = event.request.userAttributes?.phone_number;
    if (phone) {
      await snsClient.send(new PublishCommand({
        PhoneNumber: phone,
        Message: `Your verification code is: ${otp}`,
      }));
    }
  } catch (e) {
    console.warn('Failed to send SMS OTP', e);
  }

  // Send via SES (Email) if email present and SES is configured
  try {
    const email = event.request.userAttributes?.email;
    const source = process.env.SES_SOURCE_EMAIL;
    if (email && source) {
      await sesClient.send(new SendEmailCommand({
        Destination: { ToAddresses: [email] },
        Source: source,
        Message: {
          Subject: { Data: 'Your verification code' },
          Body: { Text: { Data: `Your verification code is: ${otp}` } },
        },
      }));
    }
  } catch (e) {
    console.warn('Failed to send Email OTP', e);
  }

  return event;
};
