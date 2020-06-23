import * as actions from './uploadActions';

const {
  UPLOAD_ERROR,
  PERCENT_COMPLETED_UPDATED,
  UPLOAD_STATUS_UPDATED,
} = actions;

export interface SubmittedFile {
  error?: Error;
  file: File;
  id: number;
  percentCompleted: number;
  uploading: boolean;
}

export interface UploadState {
  submittedFiles: SubmittedFile[];
}

export interface UploadErrorAction {
  type: typeof UPLOAD_ERROR;
  id: number;
  error: Error;
}

export interface UploadPercentCompletedUpdateAction {
  type: typeof PERCENT_COMPLETED_UPDATED;
  id: number;
  percentCompleted: number;
}

export interface UploadStatusUpdatedAction {
  type: typeof UPLOAD_STATUS_UPDATED;
  id: number;
  uploading: boolean;
}

export type UploadAction =
  | UploadErrorAction
  | UploadPercentCompletedUpdateAction
  | UploadStatusUpdatedAction;
