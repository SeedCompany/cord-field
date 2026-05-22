import { PeriodicReportFragment } from './PeriodicReport.graphql';

export type PeriodicReportFileField = 'reportFile' | 'narrativeFile';

export type PeriodicReportDateField = 'receivedDate' | 'narrativeReceivedDate';

export const dateFieldFor = (
  fileField: PeriodicReportFileField
): PeriodicReportDateField =>
  fileField === 'narrativeFile' ? 'narrativeReceivedDate' : 'receivedDate';

// A report that may have one of its file slots replaced with a pending File[]
// upload payload (used by edit/upload dialog flows). Other slot stays as the
// original SecuredFile from the fetched fragment.
export type PeriodicReportEditShape = Omit<
  PeriodicReportFragment,
  'reportFile' | 'narrativeFile'
> & {
  reportFile?: PeriodicReportFragment['reportFile'] | File[];
  narrativeFile?: PeriodicReportFragment['narrativeFile'] | File[];
};
