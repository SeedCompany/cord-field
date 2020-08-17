import React, { createContext, FC, useContext, useState } from 'react';
import { Directory, File, GQLOperations } from '../../../api';
import {
  ProjectDirectoryDirectory,
  ProjectDirectoryFile,
} from '../../../scenes/Projects/Files';
import { useDialog } from '../../Dialog';
import { FilePreview } from '../FilePreview';
import { FileVersionItem_FileVersion_Fragment } from '../FileVersionItem';
import { useDownloadFile } from '../hooks';
import { DeleteFile } from './DeleteFile';
import { FileVersions } from './FileVersions';
import { RenameFile } from './RenameFile';

export type FilesActionItem =
  | File
  | Directory
  | ProjectDirectoryDirectory
  | ProjectDirectoryFile
  | FileVersionItem_FileVersion_Fragment;

export type FileActionItem = File | ProjectDirectoryFile;
export type VersionActionItem = FileVersionItem_FileVersion_Fragment;
export type DirectoryActionItem = Directory | ProjectDirectoryDirectory;
export type NonDirectoryActionItem = Exclude<
  FilesActionItem,
  DirectoryActionItem
>;

export enum FileAction {
  Rename = 'rename',
  Download = 'download',
  History = 'history',
  NewVersion = 'new version',
  Delete = 'delete',
}

interface FileActionsContextProviderProps {
  context: 'project' | 'engagement';
}

export const initialFileActionsContext = {
  context: '' as FileActionsContextProviderProps['context'],
  handleFileActionClick: (
    _: FilesActionItem,
    __: Exclude<FileAction, FileAction.NewVersion>
  ) => {
    return;
  },
  previewPage: 1,
  setPreviewPage: (_: number) => {
    return;
  },
  openFilePreview: (_: NonDirectoryActionItem) => {
    return;
  },
};

export const FileActionsContext = createContext<
  typeof initialFileActionsContext
>(initialFileActionsContext);

export const FileActionsContextProvider: FC<FileActionsContextProviderProps> = (
  props
) => {
  const { context, children } = props;
  const [previewPage, setPreviewPage] = useState(1);

  const downloadFile = useDownloadFile();

  const [renameState, renameFile, fileNodeToRename] = useDialog<
    FilesActionItem
  >();
  const [versionState, showVersions, versionToView] = useDialog<
    FileActionItem
  >();
  const [deleteState, deleteFile, fileNodeToDelete] = useDialog<
    FilesActionItem
  >();
  const [previewDialogState, openFilePreview, fileToPreview] = useDialog<
    NonDirectoryActionItem
  >();

  const actions = {
    rename: (item: FilesActionItem) => renameFile(item),
    download: (item: FilesActionItem) => downloadFile(item),
    history: (item: FilesActionItem) => {
      if (item.__typename === 'File') {
        showVersions(item);
      }
    },
    delete: (item: FilesActionItem) => deleteFile(item),
  };

  const handleFileActionClick = (
    item: FilesActionItem,
    action: Exclude<FileAction, FileAction.NewVersion>
  ) => {
    actions[action](item);
  };

  const deleteRefetches =
    fileNodeToDelete?.__typename === 'FileVersion'
      ? GQLOperations.Query.FileVersions
      : GQLOperations.Query.ProjectDirectory;

  return (
    <FileActionsContext.Provider
      value={{
        context,
        handleFileActionClick,
        previewPage,
        setPreviewPage,
        openFilePreview,
      }}
    >
      <>
        {children}
        <RenameFile item={fileNodeToRename} {...renameState} />
        <DeleteFile
          item={fileNodeToDelete}
          refetchQueries={[deleteRefetches]}
          {...deleteState}
        />
        <FileVersions file={versionToView} {...versionState} />
        <FilePreview file={fileToPreview} {...previewDialogState} />
      </>
    </FileActionsContext.Provider>
  );
};

export const useFileActions = () => useContext(FileActionsContext);
