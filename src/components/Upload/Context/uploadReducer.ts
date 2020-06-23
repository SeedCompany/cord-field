import * as actions from './uploadActions';
import * as Types from './uploadTypings';

export const UploadReducer = (
  state: Types.UploadState,
  action: Types.UploadAction
) => {
  switch (action.type) {
    case actions.UPLOAD_STATUS_UPDATED:
      return uploadStatusUpdated(state, action);
    case actions.UPLOAD_ERROR:
      return uploadErrorAction(state, action);
    default: {
      return state;
    }
  }
};

function uploadErrorAction(
  state: Types.UploadState,
  action: Types.UploadErrorAction
) {
  const file = findFileById(action.id, state.submittedFiles);
  if (file) {
    const updatedFile = {
      ...file,
      error: action.error,
    };
    return replaceUpdatedFileInState(updatedFile, state);
  } else {
    return state;
  }
}

function uploadStatusUpdated(
  state: Types.UploadState,
  action: Types.UploadStatusUpdatedAction
) {
  const file = findFileById(action.id, state.submittedFiles);
  if (file) {
    const updatedFile = {
      ...file,
      uploading: action.uploading,
    };
    return replaceUpdatedFileInState(updatedFile, state);
  } else {
    return state;
  }
}

function findFileById(id: number, files: Types.SubmittedFile[]) {
  return files.find((file) => file.id === id);
}

function replaceUpdatedFileInState(
  updatedFile: Types.SubmittedFile,
  state: Types.UploadState
) {
  const { submittedFiles } = state;
  const fileIndex = submittedFiles.findIndex(
    (file) => file.id === updatedFile.id
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
