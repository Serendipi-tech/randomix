import { useMutation, useQuery } from '@apollo/client';
import { TagMutations, TagQueries } from '@randomix/graphql-schema';

const { MY_TAGS } = TagQueries;
const { CREATE_TAG } = TagMutations;

export interface Tag {
  id: string;
  name: string;
  color: string;
  isSystem: boolean;
}

interface MyTagsQuery {
  myTags: Tag[];
}

interface CreateTagMutation {
  createTag: Tag;
}

export function useTags() {
  const { data, loading, error } = useQuery<MyTagsQuery>(MY_TAGS, {
    fetchPolicy: 'cache-and-network',
  });

  const [createMutation, { loading: creating, error: createError }] =
    useMutation<CreateTagMutation>(CREATE_TAG, { refetchQueries: ['MyTags'] });

  const createTag = async (name: string, color: string) => {
    const { data: created } = await createMutation({ variables: { name, color } });
    return created?.createTag ?? null;
  };

  return {
    tags: data?.myTags ?? [],
    createTag,
    loading,
    creating,
    error: error ?? createError ?? null,
  };
}
