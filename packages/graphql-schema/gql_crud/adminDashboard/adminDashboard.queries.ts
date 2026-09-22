import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_DASHBOARD_STATS: DocumentNode = parse(`
  query AdminDashboardStats {
    adminDashboardStats {
      totalUsers
      usersGrowth {
        date
        totalUsers
      }
      usersByMembershipPlan {
        plan
        count
      }
      avgListsPerUser
      avgGroupsPerUser
      avgUsersPerGroup
    }
  }
`);
