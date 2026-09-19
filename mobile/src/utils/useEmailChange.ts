import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UserMutations, UserQueries } from '@randomix/graphql-schema';

const { REQUEST_EMAIL_CHANGE, CONFIRM_EMAIL_CHANGE } = UserMutations;
const { ME } = UserQueries;

interface RequestEmailChangeMutation {
  requestEmailChange: boolean;
}

interface ConfirmEmailChangeMutation {
  confirmEmailChange: {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    language: string | null;
  };
}

export function useEmailChange() {
  const [error, setError] = useState<string | null>(null);

  const [requestMutate, { loading: requestLoading }] =
    useMutation<RequestEmailChangeMutation>(REQUEST_EMAIL_CHANGE);

  const [confirmMutate, { loading: confirmLoading }] =
    useMutation<ConfirmEmailChangeMutation>(CONFIRM_EMAIL_CHANGE, {
      // ricarico il profilo così l'email aggiornata è subito in cache
      refetchQueries: [{ query: ME }],
    });

  const requestChange = async (newEmail: string): Promise<void> => {
    setError(null);
    await requestMutate({ variables: { newEmail } });
  };

  const confirmChange = async (otp: string): Promise<void> => {
    setError(null);
    await confirmMutate({ variables: { otp } });
  };

  return {
    requestChange,
    confirmChange,
    loading: requestLoading || confirmLoading,
    error,
    setError,
  };
}
