import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UserMutations } from '@randomix/graphql-schema';

const { REQUEST_PASSWORD_RESET, RESET_PASSWORD } = UserMutations;

interface RequestPasswordResetMutation {
  requestPasswordReset: boolean;
}

interface ResetPasswordMutation {
  resetPassword: boolean;
}

export function usePasswordReset() {
  const [error, setError] = useState<string | null>(null);

  const [requestMutate, { loading: requestLoading }] =
    useMutation<RequestPasswordResetMutation>(REQUEST_PASSWORD_RESET);

  const [resetMutate, { loading: resetLoading }] =
    useMutation<ResetPasswordMutation>(RESET_PASSWORD);

  const requestReset = async (email: string): Promise<void> => {
    setError(null);
    await requestMutate({ variables: { email } });
  };

  const confirmReset = async (
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<void> => {
    setError(null);
    await resetMutate({ variables: { email, otp, newPassword } });
  };

  return {
    requestReset,
    confirmReset,
    loading: requestLoading || resetLoading,
    error,
    setError,
  };
}
