import { ApolloError } from '@apollo/client';
import type { TFunction } from 'i18next';

const CODE_TO_KEY: Record<string, string> = {
  EMAIL_OR_USERNAME_TAKEN: 'errors:emailOrUsernameTaken',
  INVALID_CREDENTIALS: 'errors:invalidCredentials',
  INVALID_GOOGLE_TOKEN: 'errors:invalidGoogleToken',
  INVALID_OTP: 'errors:invalidOtp',
};

export function getAuthErrorMessage(error: unknown, t: TFunction): string {
  const code =
    error instanceof ApolloError
      ? (error.graphQLErrors[0]?.extensions?.code as string | undefined)
      : undefined;
  const key = code ? CODE_TO_KEY[code] : undefined;
  return t(key ?? 'errors:generic');
}
