import { gql, useApolloClient, useMutation } from '@apollo/client';
import { ItemMutations, RatingMutations } from '@randomix/graphql-schema';
import type { CompletionStatus } from './useListDetail';

const { ADD_ITEM_TO_LIST, UPDATE_USER_ITEM, REMOVE_ITEM_FROM_LIST } = ItemMutations;
const { RATE_ITEM } = RatingMutations;

// Stessa selezione campi di UPDATE_USER_ITEM: serve a leggere dalla cache i campi non toccati dal
// cambio di stato, per costruire un optimisticResponse completo senza inventare valori.
const USER_ITEM_OPTIMISTIC_FRAGMENT = gql`
  fragment UserItemOptimisticFields on User_Item {
    id
    name
    description
    note
    status
    isHidden
    category {
      id
      name
      icon
    }
    tags {
      id
      name
      color
    }
  }
`;

interface UserItemOptimisticFields {
  __typename: 'User_Item';
  id: string;
  name: string;
  description: string | null;
  note: string | null;
  status: CompletionStatus;
  isHidden: boolean;
  category: { __typename: 'Category'; id: string; name: string; icon: string };
  tags: Array<{ __typename: 'Tag'; id: string; name: string; color: string }>;
}

export interface AddItemInput {
  listId: string;
  name: string;
  categoryId: string;
  description?: string | null;
  note?: string | null;
}

export interface UpdateUserItemInput {
  name?: string;
  categoryId?: string;
  description?: string | null;
  note?: string | null;
  status?: CompletionStatus;
  isHidden?: boolean;
  tagIds?: string[];
}

interface AddItemToListResult {
  addItemToList: { id: string; userItem: { id: string } };
}

export function useItemMutations() {
  const client = useApolloClient();

  // ListDetail va ricaricata: cambia l'elenco items della lista aperta.
  // ProfileStats va ricaricata: un nuovo item cambia itemsCount di categoria nel profilo.
  const [addMutation, { loading: adding, error: addError }] = useMutation<AddItemToListResult>(ADD_ITEM_TO_LIST, {
    refetchQueries: ['ListDetail', 'ProfileStats'],
  });

  // Niente refetchQueries: la mutation ora restituisce tutti i campi che ListDetail usa (tags incluso),
  // la cache normalizzata di Apollo aggiorna da sola l'User_Item già in cache — molto più veloce di un refetch completo
  const [updateMutation, { loading: updating, error: updateError }] = useMutation(UPDATE_USER_ITEM);

  // ListDetail va ricaricata per l'elenco items. ProfileStats va ricaricata anche qui: la riga
  // List_UserItem eliminata porta con sé count/acceptedCount/skippedCount, quindi drawCount e
  // drawAcceptance esposti dal profilo possono scendere insieme alla rimozione.
  const [removeMutation, { loading: removing, error: removeError }] = useMutation(
    REMOVE_ITEM_FROM_LIST,
    { refetchQueries: ['ListDetail', 'ProfileStats'] },
  );

  const [rateMutation, { loading: rating, error: rateError }] = useMutation(RATE_ITEM, {
    refetchQueries: ['ListDetail'],
  });

  const addItemToList = async (input: AddItemInput) => {
    const { data } = await addMutation({ variables: { input } });
    return data?.addItemToList.userItem.id ?? null;
  };

  const updateUserItem = async (id: string, input: UpdateUserItemInput) => {
    // Optimistic update solo per il cambio di stato: lo SegmentedControl deve rispondere subito, senza
    // attendere il giro di rete. Gli altri campi vengono letti dalla cache (già coerenti), non inventati:
    // se l'item non è ancora in cache, niente optimisticResponse (si torna al comportamento normale).
    const cached =
      input.status !== undefined
        ? client.cache.readFragment<UserItemOptimisticFields>({
            id: client.cache.identify({ __typename: 'User_Item', id }),
            fragment: USER_ITEM_OPTIMISTIC_FRAGMENT,
            fragmentName: 'UserItemOptimisticFields',
          })
        : null;

    await updateMutation({
      variables: { id, input },
      ...(cached && {
        optimisticResponse: {
          updateUserItem: {
            ...cached,
            status: input.status,
          },
        },
      }),
    });
  };

  const removeItemFromList = async (id: string) => {
    await removeMutation({ variables: { id } });
  };

  const rateItem = async (userItemId: string, value: number, note?: string | null) => {
    await rateMutation({ variables: { userItemId, value, note } });
  };

  return {
    addItemToList,
    updateUserItem,
    removeItemFromList,
    rateItem,
    saving: adding || updating || rating,
    removing,
    error: addError ?? updateError ?? removeError ?? rateError ?? null,
  };
}
