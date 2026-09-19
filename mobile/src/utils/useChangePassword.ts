import { useMutation } from '@apollo/client';
import { UserMutations } from '@randomix/graphql-schema';

const { CHANGE_PASSWORD } = UserMutations;

interface ChangePasswordMutation {
  changePassword: boolean;
}

interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const [mutate, { loading, error }] = useMutation<ChangePasswordMutation>(CHANGE_PASSWORD);

  const changePassword = async (input: ChangePasswordInput) => {
    await mutate({ variables: input });
  };

  return { changePassword, loading, error: error ?? null };
}
