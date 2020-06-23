import * as actions from './uploadActions';

export interface UploadFile {
  completedAt?: Date;
  error?: Error;
  file: File;
  fileName?: string;
  uploadId: number;
  percentCompleted: number;
  uploading: boolean;
}

export interface UploadState {
  files: UploadFile[];
}

interface FileAction {
  id: number;
}

export interface FileSubmittedAction {
  type: typeof actions.FILE_SUBMITTED;
  file: File;
}

export interface RemoveCompletedUploadAction {
  type: typeof actions.REMOVE_COMPLETED_UPLOAD;
  id: number;
}

export interface FileUploadCompletedAction extends FileAction {
  type: typeof actions.FILE_UPLOAD_COMPLETED;
  completedAt: UploadFile['completedAt'];
}

export interface UploadErrorOccurredAction extends FileAction {
  type: typeof actions.UPLOAD_ERROR_OCCURRED;
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

// export interface UploadFieldUpdateAction {
//   type: keyof typeof actions;
//   id: UploadFile['uploadId'];
//   <K extends keyof Except<UploadFile, 'file' | 'uploadId'>>(
//     arg: K
//   ): UploadFile[K];
// }

export type UploadAction =
  | FileSubmittedAction
  | RemoveCompletedUploadAction
  | FileUploadCompletedAction
  | UploadErrorOccurredAction
  | UploadPercentCompletedUpdateAction
  | UploadStatusUpdatedAction;
