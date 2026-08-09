'use client';

import { useMutation } from '@apollo/client';
import { AdminTagMutations } from '@randomix/graphql-schema';

const { ADMIN_PROMOTE_TAG_TO_SYSTEM } = AdminTagMutations;

export function usePromoteTag() {
  const [promote, { loading, error }] = useMutation(ADMIN_PROMOTE_TAG_TO_SYSTEM);

  const promoteTag = (name: string) => promote({ variables: { name } });

  return { promoteTag, promoting: loading, error };
}
