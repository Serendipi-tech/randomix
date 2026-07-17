import { useMutation, useQuery } from '@apollo/client';
import { UserMutations, UserQueries } from '@randomix/graphql-schema';

const { ME } = UserQueries;
const { UPDATE_PROFILE } = UserMutations;

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  language: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

interface MeQuery {
  me: Profile | null;
}

interface UpdateProfileInput {
  username?: string;
  avatarUrl?: string;
  language?: string;
}

export function useProfile() {
  const { data, loading, error } = useQuery<MeQuery>(ME, {
    fetchPolicy: 'cache-and-network',
  });

  const [updateMutation, { loading: saving, error: saveError }] = useMutation(UPDATE_PROFILE, {
    // ricarico il profilo così la cache resta allineata
    refetchQueries: [{ query: ME }],
  });

  const updateProfile = async (input: UpdateProfileInput) => {
    await updateMutation({ variables: { input } });
  };

  return {
    profile: data?.me ?? null,
    loading,
    error: error ?? null,
    updateProfile,
    saving,
    saveError: saveError ?? null,
  };
}
