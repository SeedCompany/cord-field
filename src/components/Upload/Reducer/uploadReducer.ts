import * as actions from './uploadActions';
import * as Types from './uploadTypings';

export const uploadReducer = (
  state: Types.UploadState,
  action: Types.UploadAction
) => {
  switch (action.type) {
    case actions.FILE_SUBMITTED: {
      const { submittedFiles } = state;
      const queueId =
        submittedFiles.reduce((id, file) => {
          return file.queueId > id ? file.queueId : id;
        }, 0) + 1;
      const fileWithQueueId = {
        ...action.file,
        queueId,
      };
      return {
        ...state,
        submittedFiles: submittedFiles.concat(fileWithQueueId),
      };
    }

    case actions.REMOVE_COMPLETED_UPLOAD: {
      const { submittedFiles } = state;
      const index = submittedFiles.findIndex(
        (file) => file.queueId === action.queueId
      );
      const updatedSubmittedFiles = submittedFiles
        .slice(0, index)
        .concat(submittedFiles.slice(index + 1));
      return {
        ...state,
        files: updatedSubmittedFiles,
      };
    }

    case actions.FILE_UPLOAD_ERROR_OCCURRED: {
      const { submittedFiles } = state;
      const file = findFileById(action.queueId, submittedFiles);
      if (file) {
        const updatedFile = {
          ...file,
          error: action.error,
          uploading: false,
        };
        return replaceUpdatedFileInState(updatedFile, state);
      } else {
        return state;
      }
    }

    case actions.FILE_UPLOAD_COMPLETED: {
      const { submittedFiles } = state;
      const file = findFileById(action.queueId, submittedFiles);
      if (file) {
        const updatedFile = {
          ...file,
          completedAt: action.completedAt,
          uploading: false,
        };
        return replaceUpdatedFileInState(updatedFile, state);
      } else {
        return state;
      }
    }

    case actions.FILE_UPLOAD_REQUEST_SUCCEEDED:
      return updateSimpleFileState(state, action, 'uploadId');

    case actions.UPLOAD_STATUS_UPDATED:
      return updateSimpleFileState(state, action, 'uploading');

    case actions.PERCENT_COMPLETED_UPDATED:
      return updateSimpleFileState(state, action, 'percentCompleted');

    default: {
      return state;
    }
  }
};

function updateSimpleFileState(
  state: Types.UploadState,
  action: Exclude<
    Types.UploadAction,
    Types.FileSubmittedAction | Types.RemoveCompletedUploadAction
  >,
  key: keyof Types.UploadFile
) {
  const file = findFileById(action.queueId, state.submittedFiles);
  if (file) {
    const updatedFile = {
      ...file,
      [key]: action[key as keyof typeof action],
    };
    return replaceUpdatedFileInState(updatedFile, state);
  } else {
    return state;
  }
}

function findFileById(
  queueId: Types.UploadFile['queueId'],
  submittedFiles: Types.UploadFile[]
) {
  return submittedFiles.find((file) => file.queueId === queueId);
}

function replaceUpdatedFileInState(
  updatedFile: Types.UploadFile,
  state: Types.UploadState
) {
  const { submittedFiles } = state;
  const fileIndex = submittedFiles.findIndex(
    (file) => file.uploadId === updatedFile.uploadId
  );
  if (fileIndex >= 0) {
    return {
      ...state,
      submittedFiles: submittedFiles
        .slice(0, fileIndex)
        .concat(updatedFile)
        .concat(submittedFiles.slice(fileIndex + 1)),
    };
  } else {
    return state;
  }
}
