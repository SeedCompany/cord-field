import { createContext, useCallback, useContext, useMemo } from 'react';
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
  openFilePreview: (_: NonDirectoryActionItem) => {
    return;
  },
};

export const FileActionsContext = createContext<
  typeof initialFileActionsContext
>(initialFileActionsContext);

export const FileActionsContextProvider = (props: ChildrenProp) => {
  const { children } = props;

  const [renameState, renameFile, fileNodeToRename] =
    useDialog<FilesActionItem>();

  const [versionState, showVersions, versionToView] =
    useDialog<VersionActionPayload>();
  const [deleteState, deleteFile, fileNodeToDelete] =
    useDialog<FilesActionItem>();
  const [previewDialogState, openFilePreview, fileToPreview] =
    useDialog<NonDirectoryActionItem>();

  const actions = useMemo(
    () => ({
      rename: (item: FilesActionItem) => renameFile(item),
      download: (_item: FilesActionItem) => {
        // download happens with browser via anchor tag
      },
      history: (item: FileActionItem, actions: FileAction[]) =>
        showVersions({ item, actions }),
      delete: (item: FilesActionItem) => deleteFile(item),
    }),
    [deleteFile, renameFile, showVersions]
  );

  const handleFileActionClick = useCallback(
    (params: HandleFileActionClickParams) => {
      const isHistoryAction = (
        params: HandleFileActionClickParams
      ): params is HistoryActionClickParams =>
        params.action === FileAction.History;
      isHistoryAction(params)
        ? actions.history(params.item, params.versionActions)
        : actions[params.action](params.item);
    },
    [actions]
  );

  const deleteRefetches =
    fileNodeToDelete?.__typename === 'FileVersion'
      ? GQLOperations.Query.FileVersions
      : GQLOperations.Query.ProjectDirectory;

  const context = useMemo(
    () => ({
      handleFileActionClick,
      openFilePreview,
    }),
    [handleFileActionClick, openFilePreview]
  );
  return (
    <FileActionsContext.Provider value={context}>
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
        {fileToPreview && (
          <FilePreview file={fileToPreview} {...previewDialogState} />
        )}
      </>
    </FileActionsContext.Provider>
  );
};

export const useFileActions = () => useContext(FileActionsContext);
