import { useMutation } from '@apollo/client';
import { RandomizerMutations } from '@randomix/graphql-schema';
import type { ListItemEntry } from './useListDetail';

const { DRAW_FROM_LIST, ACCEPT_DRAW } = RandomizerMutations;

interface DrawFromListMutation {
  drawFromList: ListItemEntry;
}

export function useListDraw() {
  const [drawMutation, { loading: drawing, error: drawError }] =
    useMutation<DrawFromListMutation>(DRAW_FROM_LIST);

  const [acceptMutation, { loading: accepting, error: acceptError }] = useMutation(ACCEPT_DRAW);

  // previousEntryId presente solo alla rigenerazione: fa scattare +1 skipped sul precedente
  const draw = async (listId: string, previousEntryId?: string) => {
    const { data } = await drawMutation({ variables: { listId, previousEntryId } });
    return data?.drawFromList ?? null;
  };

  const accept = async (entryId: string) => {
    await acceptMutation({ variables: { entryId } });
  };

  return {
    draw,
    accept,
    drawing,
    accepting,
    error: drawError ?? acceptError ?? null,
  };
}
