import React, { FC } from 'react';
import { DeleteFile } from './DeleteFile';
import { useFileActions } from './FileActionsContext';
import { FileVersions } from './FileVersions';
import { RenameFile } from './RenameFile';
import { UploadFileVersion } from './UploadFileVersion';

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
