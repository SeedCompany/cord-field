import * as actions from './uploadActions';
import * as Types from './uploadTypings';

export const uploadReducer = (
  state: Types.UploadState,
  action: Types.UploadAction
) => {
  switch (action.type) {
    case actions.FILE_SUBMITTED: {
      return {
        ...state,
        files: state.files.concat(action.file),
      };
    }
    case actions.REMOVE_COMPLETED_UPLOAD: {
      const { files } = state;
      const index = files.findIndex((file) => file.uploadId === action.id);
      const updatedSubmittedFiles = files
        .slice(0, index)
        .concat(files.slice(index + 1));
      return {
        ...state,
        files: updatedSubmittedFiles,
      };
    }
    case actions.UPLOAD_STATUS_UPDATED:
      return updateSimpleFileState(state, action, 'uploading');
    case actions.PERCENT_COMPLETED_UPDATED:
      return updateSimpleFileState(state, action, 'percentCompleted');
    case actions.FILE_UPLOAD_ERROR_OCCURRED: {
      const { files } = state;
      const file = findFileById(action.id, files);
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
      const { files } = state;
      const file = findFileById(action.id, files);
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
  const file = findFileById(action.id, state.files);
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
  id: Types.UploadFile['uploadId'],
  files: Types.UploadFile[]
) {
  return files.find((file) => file.uploadId === id);
}

function replaceUpdatedFileInState(
  updatedFile: Types.UploadFile,
  state: Types.UploadState
) {
  const { files } = state;
  const fileIndex = files.findIndex(
    (file) => file.uploadId === updatedFile.uploadId
  );
  if (fileIndex >= 0) {
    return {
      ...state,
      files: files
        .slice(0, fileIndex)
        .concat(updatedFile)
        .concat(files.slice(fileIndex + 1)),
    };
  } else {
    return state;
  }
}
