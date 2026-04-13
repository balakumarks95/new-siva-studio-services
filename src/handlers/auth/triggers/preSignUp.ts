import { PreSignUpTriggerHandler } from 'aws-lambda';

// PreSignUp trigger enforces: if `custom:role` === 'admin' then email must be present.
export const handler: PreSignUpTriggerHandler = async (event) => {
  try {
    const attrs = event.request?.userAttributes || {};
    const role = attrs['custom:role'] || attrs['custom:Role'] || attrs.role;

    if (role === 'admin') {
      const email = attrs.email;
      if (!email) {
        throw new Error('Admin users require an email address');
      }
    }

    return event;
  } catch (err) {
    // Throwing an error will stop the signup and return the message to the caller
    throw err;
  }
};
