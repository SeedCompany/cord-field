import * as actions from './uploadActions';

export type UploadCallback = (
  uploadId: string,
  fileName: string
) => Promise<void>;

export interface UploadFile {
  callback?: UploadCallback;
  completedAt?: Date;
  error?: Error;
  file: File;
  fileName: string;
  percentCompleted: number;
  uploadId: string;
  uploading: boolean;
}

export interface UploadState {
  files: UploadFile[];
}

interface FileAction {
  id: UploadFile['uploadId'];
}

export interface FileSubmittedAction {
  type: typeof actions.FILE_SUBMITTED;
  file: UploadFile;
  callback?: UploadCallback;
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
  | RemoveCompletedUploadAction
  | FileUploadCompletedAction
  | UploadErrorOccurredAction
  | UploadPercentCompletedUpdateAction
  | UploadStatusUpdatedAction;
