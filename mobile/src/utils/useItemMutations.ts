import { useMutation } from '@apollo/client';
import { ItemMutations } from '@randomix/graphql-schema';
import type { Category } from './useListCategories';
import type { CompletionStatus } from './useListDetail';

const { ADD_ITEM_TO_LIST, UPDATE_USER_ITEM, REMOVE_ITEM_FROM_LIST } = ItemMutations;

export interface AddItemInput {
  listId: string;
  name: string;
  category: Category;
  description?: string | null;
  note?: string | null;
}

export interface UpdateUserItemInput {
  description?: string | null;
  note?: string | null;
  status?: CompletionStatus;
  isHidden?: boolean;
}

export function useItemMutations() {
  // ListDetail va ricaricata: cambia l'elenco items della lista aperta
  const [addMutation, { loading: adding, error: addError }] = useMutation(ADD_ITEM_TO_LIST, {
    refetchQueries: ['ListDetail'],
  });

  const [updateMutation, { loading: updating, error: updateError }] = useMutation(
    UPDATE_USER_ITEM,
    { refetchQueries: ['ListDetail'] },
  );

  const [removeMutation, { loading: removing, error: removeError }] = useMutation(
    REMOVE_ITEM_FROM_LIST,
    { refetchQueries: ['ListDetail'] },
  );

  const addItemToList = async (input: AddItemInput) => {
    await addMutation({ variables: { input } });
  };

  const updateUserItem = async (id: string, input: UpdateUserItemInput) => {
    await updateMutation({ variables: { id, input } });
  };

  const removeItemFromList = async (id: string) => {
    await removeMutation({ variables: { id } });
  };

  return {
    addItemToList,
    updateUserItem,
    removeItemFromList,
    saving: adding || updating,
    removing,
    error: addError ?? updateError ?? removeError ?? null,
  };
}
