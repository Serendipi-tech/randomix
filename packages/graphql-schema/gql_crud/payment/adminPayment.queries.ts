import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_PAYMENT_STATS: DocumentNode = parse(`
  query AdminPaymentStats($days: Int!) {
    adminPaymentStats(days: $days) {
      totalRevenue
      paymentsByStatus {
        status
        count
      }
      revenueByDay {
        date
        totalAmount
      }
    }
  }
`);
