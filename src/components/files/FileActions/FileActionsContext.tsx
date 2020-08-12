import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Directory, File } from '../../../api';
import { DialogState, ShowFn, useDialog } from '../../Dialog';
import { useDownloadFile } from '../hooks';

export type FileActionItem = File | Directory;

export enum FileAction {
  Rename = 'rename',
  Download = 'download',
  History = 'history',
  NewVersion = 'new version',
  Delete = 'delete',
}

type FileActionHandler = (item: FileActionItem, action: FileAction) => void;

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
  fileNodeToRename: FileActionItem | undefined;
  versionState: DialogState;
  versionToView: File | undefined;
  newVersionState: DialogState;
  versionToCreate: File | undefined;
  deleteState: DialogState;
  fileNodeToDelete: FileActionItem | undefined;
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
    FileActionItem
  >();
  const [versionState, showVersions, versionToView] = useDialog<File>();
  const [newVersionState, createNewVersion, versionToCreate] = useDialog<
    File
  >();
  const [deleteState, deleteFile, fileNodeToDelete] = useDialog<
    FileActionItem
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
    rename: (item: FileActionItem) => renameFile(item),
    download: (item: FileActionItem) => downloadFile(item),
    history: (item: FileActionItem) => showVersions(item as File),
    'new version': (item: FileActionItem) => createNewVersion(item as File),
    delete: (item: FileActionItem) => deleteFile(item),
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
        newVersionState,
        versionToCreate,
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
