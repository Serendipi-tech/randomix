import { useMutation } from '@apollo/client';
import { ListMutations } from '@randomix/graphql-schema';

const { CREATE_LIST, UPDATE_LIST, DELETE_LIST } = ListMutations;

export interface ListFormInput {
  name: string;
  icon: string;
  color: string;
  description?: string | null;
  isHidden?: boolean;
  categoryIds?: string[];
}

interface CreatedList {
  id: string;
}

interface CreateListMutation {
  createList: CreatedList;
}

export function useListMutations() {
  // MyLists va ricaricata: cambiano membership e ordinamento (updatedAt desc)
  const [createMutation, { loading: creating, error: createError }] =
    useMutation<CreateListMutation>(CREATE_LIST, { refetchQueries: ['MyLists'] });

  const [updateMutation, { loading: updating, error: updateError }] = useMutation(UPDATE_LIST, {
    refetchQueries: ['MyLists'],
  });

  const [deleteMutation, { loading: deleting, error: deleteError }] = useMutation(DELETE_LIST, {
    refetchQueries: ['MyLists'],
  });

  const createList = async (input: ListFormInput) => {
    const { data } = await createMutation({ variables: { input } });
    return data?.createList ?? null;
  };

  const updateList = async (id: string, input: Partial<ListFormInput>) => {
    await updateMutation({ variables: { id, input } });
  };

  const deleteList = async (id: string) => {
    await deleteMutation({ variables: { id } });
  };

  return {
    createList,
    updateList,
    deleteList,
    saving: creating || updating,
    deleting,
    error: createError ?? updateError ?? deleteError ?? null,
  };
}
