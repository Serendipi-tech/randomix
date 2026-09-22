import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const ADMIN_UPDATE_REPORT_STATUS: DocumentNode = parse(`
  mutation AdminUpdateReportStatus($id: ID!, $status: STATUS_REPORT!) {
    adminUpdateReportStatus(id: $id, status: $status)
  }
`);
