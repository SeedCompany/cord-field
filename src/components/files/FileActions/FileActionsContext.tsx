import React, { createContext, useContext, useState } from 'react';
import { GQLOperations } from '~/api';
import { ChildrenProp, isTypename } from '~/common';
import { useDialog } from '../../Dialog';
import { FilePreview } from '../FilePreview';
import {
  FileNodeInfo_Directory_Fragment as Directory,
  FileNodeInfo_File_Fragment as File,
  FileNodeInfoFragment as FileNode,
  FileNodeInfo_FileVersion_Fragment as FileVersion,
} from '../files.graphql';
import { useDownloadFile } from '../hooks';
import { DeleteFile } from './DeleteFile';
import { FileAction } from './FileAction.enum';
import { FileVersions } from './FileVersions';
import { RenameFile } from './RenameFile';

/**
 * Strictly speaking, we don't totally need to re-declare these,
 * but we're playing it safe in case we need to later expand the
 * types allowed to be used with `FileActionsContext`.
 */
export type FilesActionItem = FileNode;

export type FileActionItem = File;
export type VersionActionItem = FileVersion;
export type NonVersionActionItem = Exclude<FilesActionItem, VersionActionItem>;
export type DirectoryActionItem = Directory;
export type NonDirectoryActionItem = Exclude<
  FilesActionItem,
  DirectoryActionItem
>;

export const isFileVersion = isTypename<VersionActionItem>('FileVersion');

export type PermittedActions =
  | FileAction[]
  | {
      file: FileAction[];
      version: FileAction[];
    };

interface VersionActionPayload {
  item: FileActionItem;
  actions: PermittedActions;
}

interface ActionClickParams {
  action: Exclude<
    FileAction,
    | FileAction.NewVersion
    | FileAction.History
    | FileAction.UpdateReceivedDate
    | FileAction.Skip
    | FileAction.EditSkipReason
  >;
  item: FilesActionItem;
}

interface HistoryActionClickParams {
  action: FileAction.History;
  item: FileActionItem;
  versionActions: FileAction[];
}

export type HandleFileActionClickParams =
  | ActionClickParams
  | HistoryActionClickParams;

export const initialFileActionsContext = {
  handleFileActionClick: (_: HandleFileActionClickParams) => {
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

export const FileActionsContextProvider = (props: ChildrenProp) => {
  const { children } = props;
  const [previewPage, setPreviewPage] = useState(1);

  const downloadFile = useDownloadFile();

  const [renameState, renameFile, fileNodeToRename] =
    useDialog<FilesActionItem>();

  const [versionState, showVersions, versionToView] =
    useDialog<VersionActionPayload>();
  const [deleteState, deleteFile, fileNodeToDelete] =
    useDialog<FilesActionItem>();
  const [previewDialogState, openFilePreview, fileToPreview] =
    useDialog<NonDirectoryActionItem>();

  const actions = {
    rename: (item: FilesActionItem) => renameFile(item),
    download: (item: FilesActionItem) => void downloadFile(item),
    history: (item: FileActionItem, actions: FileAction[]) =>
      showVersions({ item, actions }),
    delete: (item: FilesActionItem) => deleteFile(item),
  };

  const handleFileActionClick = (params: HandleFileActionClickParams) => {
    const isHistoryAction = (
      params: HandleFileActionClickParams
    ): params is HistoryActionClickParams =>
      params.action === FileAction.History;
    isHistoryAction(params)
      ? actions.history(params.item, params.versionActions)
      : actions[params.action](params.item);
  };

  const deleteRefetches =
    fileNodeToDelete?.__typename === 'FileVersion'
      ? GQLOperations.Query.FileVersions
      : GQLOperations.Query.ProjectDirectory;

  return (
    <FileActionsContext.Provider
      value={{
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
        <FileVersions
          file={versionToView?.item}
          actions={versionToView?.actions}
          {...versionState}
        />
        <FilePreview file={fileToPreview} {...previewDialogState} />
      </>
    </FileActionsContext.Provider>
  );
};

export const useFileActions = () => useContext(FileActionsContext);
