import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
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
export type NonDirectoryActionItem = Exclude<
  FilesActionItem,
  Directory | ProjectDirectoryDirectory
>;

export enum FileAction {
  Rename = 'rename',
  Download = 'download',
  History = 'history',
  NewVersion = 'new version',
  Delete = 'delete',
}

export const initialFileActionsContext = {
  handleFileActionClick: (
    _: FilesActionItem,
    __: Exclude<FileAction, FileAction.NewVersion>
  ) => {
    return;
  },
  previewError: '',
  setPreviewError: (_: string) => {
    return;
  },
  previewLoading: false,
  setPreviewLoading: (_: boolean) => {
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

export const FileActionsContextProvider: FC = ({ children }) => {
  const [previewError, setPreviewError] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
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
      ? (GQLOperations.Query.FileVersions as keyof typeof GQLOperations.Query)
      : (GQLOperations.Query
          .ProjectDirectory as keyof typeof GQLOperations.Query);

  return (
    <FileActionsContext.Provider
      value={{
        handleFileActionClick,
        previewLoading,
        setPreviewLoading,
        previewError,
        setPreviewError,
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

export const usePreviewError = () => {
  const { setPreviewError, setPreviewLoading } = useFileActions();
  const handlePreviewError = useCallback(
    (error: string) => {
      setPreviewError(error);
      setPreviewLoading(false);
    },
    [setPreviewError, setPreviewLoading]
  );
  return handlePreviewError;
};
