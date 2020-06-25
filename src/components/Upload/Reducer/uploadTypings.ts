import * as actions from './uploadActions';

export type UploadCallback = (
  uploadId: string,
  fileName: string
) => Promise<void>;

export interface FileInput {
  file: File;
  fileName: string;
  callback?: UploadCallback;
}

export interface UploadFile {
  callback?: UploadCallback;
  completedAt?: Date;
  error?: Error;
  file: File;
  fileName: string;
  percentCompleted: number;
  queueId: number;
  uploadId?: string;
  uploading: boolean;
}

export interface UploadState {
  submittedFiles: UploadFile[];
}

interface FileAction {
  queueId: UploadFile['queueId'];
}

export interface FileSubmittedAction {
  type: typeof actions.FILES_SUBMITTED;
  files: FileInput[];
  callback?: UploadCallback;
}

export interface FileUploadRequestSucceeded extends FileAction {
  type: typeof actions.FILE_UPLOAD_REQUEST_SUCCEEDED;
  uploadId: UploadFile['uploadId'];
}

export interface RemoveCompletedUploadAction extends FileAction {
  type: typeof actions.REMOVE_COMPLETED_UPLOAD;
}

export interface FileUploadCompletedAction extends FileAction {
  type: typeof actions.FILE_UPLOAD_COMPLETED;
  completedAt: UploadFile['completedAt'];
}

export interface UploadErrorOccurredAction extends FileAction {
  type: typeof actions.FILE_UPLOAD_ERROR_OCCURRED;
  error: UploadFile['error'];
}

export interface UploadPercentCompletedUpdateAction extends FileAction {
  type: typeof actions.PERCENT_COMPLETED_UPDATED;
  percentCompleted: UploadFile['percentCompleted'];
}

export interface UploadStatusUpdatedAction extends FileAction {
  type: typeof actions.UPLOAD_STATUS_UPDATED;
  uploading: UploadFile['uploading'];
}

export type UploadAction =
  | FileSubmittedAction
  | FileUploadRequestSucceeded
  | RemoveCompletedUploadAction
  | FileUploadCompletedAction
  | UploadErrorOccurredAction
  | UploadPercentCompletedUpdateAction
  | UploadStatusUpdatedAction;
