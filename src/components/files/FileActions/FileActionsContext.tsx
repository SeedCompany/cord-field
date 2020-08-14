import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Directory, File } from '../../../api';
import {
  ProjectDirectoryDirectory,
  ProjectDirectoryFile,
} from '../../../scenes/Projects/Files';
import { ExcludeImplementationFromUnion } from '../../../util';
import { DialogState, ShowFn, useDialog } from '../../Dialog';
import { FileVersionItem_FileVersion_Fragment } from '../FileVersionItem';
import { useDownloadFile } from '../hooks';

export type FilesActionItem =
  | File
  | Directory
  | ProjectDirectoryDirectory
  | ProjectDirectoryFile
  | FileVersionItem_FileVersion_Fragment;

export type FileVersionActionItem = ExcludeImplementationFromUnion<
  FilesActionItem,
  ProjectDirectoryDirectory | ProjectDirectoryFile | Directory | File
>;

export enum FileAction {
  Rename = 'rename',
  Download = 'download',
  History = 'history',
  NewVersion = 'new version',
  Delete = 'delete',
}

type FileActionHandler = (
  item: FilesActionItem,
  action: Exclude<FileAction, FileAction.NewVersion>
) => void;

interface PreviewState {
  dialogState: DialogState;
  previewError: string;
  setPreviewError: (message: string) => void;
  previewLoading: boolean;
  setPreviewLoading: (isLoading: boolean) => void;
  previewPage: number;
  setPreviewPage: (page: number) => void;
}

export interface FileActionsContextValue {
  handleFileActionClick: FileActionHandler;
  renameState: DialogState;
  fileNodeToRename: FilesActionItem | undefined;
  versionState: DialogState;
  versionToView: File | undefined;
  deleteState: DialogState;
  fileNodeToDelete: FilesActionItem | undefined;
  previewState: PreviewState;
  fileToPreview: File | undefined;
  openFilePreview: ShowFn<File>;
}

const initialDialogState = {
  open: false,
  onClose: () => null,
  onExited: () => null,
};

export const initialFileActionsContext = {
  handleFileActionClick: () => null,
  renameState: initialDialogState,
  fileNodeToRename: undefined,
  versionState: initialDialogState,
  versionToView: undefined,
  newVersionState: initialDialogState,
  versionToCreate: undefined,
  deleteState: initialDialogState,
  fileNodeToDelete: undefined,
  previewState: {
    dialogState: initialDialogState,
    previewError: '',
    setPreviewError: () => null,
    previewLoading: false,
    setPreviewLoading: () => null,
    previewPage: 1,
    setPreviewPage: () => null,
  },
  fileToPreview: undefined,
  openFilePreview: () => null,
};

export const FileActionsContext = createContext<FileActionsContextValue>(
  initialFileActionsContext
);

export const FileActionsContextProvider: FC = ({ children }) => {
  const [previewError, setPreviewError] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);

  const downloadFile = useDownloadFile();

  const [renameState, renameFile, fileNodeToRename] = useDialog<
    FilesActionItem
  >();
  const [versionState, showVersions, versionToView] = useDialog<File>();
  const [deleteState, deleteFile, fileNodeToDelete] = useDialog<
    FilesActionItem
  >();
  const [previewDialogState, openFilePreview, fileToPreview] = useDialog<
    File
  >();
  const previewState = {
    dialogState: previewDialogState,
    previewError,
    setPreviewError,
    previewLoading,
    setPreviewLoading,
    previewPage,
    setPreviewPage,
  };

  const actions = {
    rename: (item: FilesActionItem) => renameFile(item),
    download: (item: FilesActionItem) => downloadFile(item),
    history: (item: FilesActionItem) => showVersions(item as File),
    delete: (item: FilesActionItem) => deleteFile(item),
  };

  const handleFileActionClick: FileActionHandler = (item, action) => {
    actions[action](item);
  };

  return (
    <FileActionsContext.Provider
      value={{
        handleFileActionClick,
        renameState,
        fileNodeToRename,
        versionState,
        versionToView,
        deleteState,
        fileNodeToDelete,
        previewState,
        fileToPreview,
        openFilePreview,
      }}
    >
      {children}
    </FileActionsContext.Provider>
  );
};

export const useFileActions = () => useContext(FileActionsContext);

export const usePreview = () => {
  const { previewState } = useFileActions();
  return { ...previewState };
};

export const usePreviewError = () => {
  const { setPreviewError, setPreviewLoading } = usePreview();
  const handlePreviewError = useCallback(
    (error: string) => {
      setPreviewError(error);
      setPreviewLoading(false);
    },
    [setPreviewError, setPreviewLoading]
  );
  return handlePreviewError;
};
