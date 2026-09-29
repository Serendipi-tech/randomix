import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const PROFILE_STATS: DocumentNode = parse(`
  query ProfileStats {
    profileStats {
      categoryStats {
        categoryId
        name
        icon
        itemsCount
        drawCount
      }
      completionBreakdown {
        notStarted
        inProgress
        completed
      }
      drawAcceptance {
        accepted
        skipped
      }
    }
  }
`);
