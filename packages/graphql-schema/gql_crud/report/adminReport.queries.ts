import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_REPORTS: DocumentNode = parse(`
  query AdminReports($status: STATUS_REPORT, $reportType: REPORT_TYPE, $limit: Int, $cursor: String) {
    adminReports(status: $status, reportType: $reportType, limit: $limit, cursor: $cursor) {
      reports {
        id
        title
        reportType
        status
        senderUsername
        targetLabel
        createdAt
      }
      nextCursor
    }
  }
`);

export const ADMIN_REPORT: DocumentNode = parse(`
  query AdminReport($id: ID!) {
    adminReport(id: $id) {
      id
      title
      body
      attachedFiles
      reportType
      status
      senderUsername
      targetLabel
      createdAt
    }
  }
`);
