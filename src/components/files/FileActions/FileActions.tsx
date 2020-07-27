import React, { FC } from 'react';
import {
  DeleteFile,
  FileVersions,
  RenameFile,
  UploadFileVersion,
  useFileActions,
} from '.';

export const FileActions: FC = () => {
  const {
    fileNodeToRename,
    renameState,
    fileNodeToDelete,
    deleteState,
    versionToView,
    versionState,
    versionToCreate,
    newVersionState,
  } = useFileActions();
  return (
    <>
      <RenameFile item={fileNodeToRename} {...renameState} />
      <DeleteFile item={fileNodeToDelete} {...deleteState} />
      <FileVersions file={versionToView} {...versionState} />
      <UploadFileVersion file={versionToCreate} {...newVersionState} />
    </>
  );
};
