import { useMutation, useQuery } from '@apollo/client';
import { TagMutations, TagQueries } from '@randomix/graphql-schema';

const { MY_TAGS } = TagQueries;
const { CREATE_TAG, UPDATE_TAG, DELETE_TAG } = TagMutations;

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

interface UpdateTagMutation {
  updateTag: Tag;
}

export function useTags() {
  const { data, loading, error } = useQuery<MyTagsQuery>(MY_TAGS, {
    fetchPolicy: 'cache-and-network',
  });

  const [createMutation, { loading: creating, error: createError }] =
    useMutation<CreateTagMutation>(CREATE_TAG, { refetchQueries: ['MyTags'] });

  // ListDetail va ricaricata anche qui: rinominare/eliminare un tag ne cambia la visualizzazione sugli item già in lista
  const [updateMutation, { loading: updating, error: updateError }] =
    useMutation<UpdateTagMutation>(UPDATE_TAG, { refetchQueries: ['MyTags', 'ListDetail'] });

  const [deleteMutation, { loading: deleting, error: deleteError }] = useMutation(DELETE_TAG, {
    refetchQueries: ['MyTags', 'ListDetail'],
  });

  const createTag = async (name: string, color: string) => {
    const { data: created } = await createMutation({ variables: { name, color } });
    return created?.createTag ?? null;
  };

  const updateTag = async (id: string, name: string, color: string) => {
    const { data: updated } = await updateMutation({ variables: { id, name, color } });
    return updated?.updateTag ?? null;
  };

  const deleteTag = async (id: string) => {
    await deleteMutation({ variables: { id } });
  };

  return {
    tags: data?.myTags ?? [],
    createTag,
    updateTag,
    deleteTag,
    loading,
    creating,
    updating,
    deleting,
    error: error ?? createError ?? updateError ?? deleteError ?? null,
  };
}
