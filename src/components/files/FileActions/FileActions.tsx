import React, { FC } from 'react';
import { GQLOperations } from '../../../api';
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

  const deleteRefetches =
    fileNodeToDelete?.__typename === 'FileVersion'
      ? (GQLOperations.Query.FileVersions as keyof typeof GQLOperations.Query)
      : (GQLOperations.Query
          .ProjectDirectory as keyof typeof GQLOperations.Query);

  return (
    <>
      <RenameFile item={fileNodeToRename} {...renameState} />
      <DeleteFile
        item={fileNodeToDelete}
        refetchQueries={[deleteRefetches]}
        {...deleteState}
      />
      <FileVersions file={versionToView} {...versionState} />
    </>
  );
};
