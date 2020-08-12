import React, { FC } from 'react';
import { DeleteFile } from './DeleteFile';
import { useFileActions } from './FileActionsContext';
import { FileVersions } from './FileVersions';
import { RenameFile } from './RenameFile';

export const FileActions: FC = () => {
  const {
    fileNodeToRename,
    renameState,
    fileNodeToDelete,
    deleteState,
    versionToView,
    versionState,
  } = useFileActions();
  return (
    <>
      <RenameFile item={fileNodeToRename} {...renameState} />
      <DeleteFile item={fileNodeToDelete} {...deleteState} />
      <FileVersions file={versionToView} {...versionState} />
    </>
  );
};
