import React, { createContext, FC, useContext, useState } from 'react';
import { Directory, File, GQLOperations } from '../../../api';
import { InternshipEngagementDetailFragment as InternshipEngagement } from '../../../scenes/Engagement/InternshipEngagement';
import { LanguageEngagementDetailFragment as LanguageEngagement } from '../../../scenes/Engagement/LanguageEngagement';
import {
  ProjectDirectoryDirectory,
  ProjectDirectoryFile,
} from '../../../scenes/Projects/Files';
import { useDialog } from '../../Dialog';
import { FilePreview } from '../FilePreview';
import { FileVersionItem_FileVersion_Fragment as FileVersion } from '../FileVersionItem';
import { useDownloadFile } from '../hooks';
import { DeleteFile } from './DeleteFile';
import { FileVersions } from './FileVersions';
import { RenameFile } from './RenameFile';

type GrowthPlan = NonNullable<InternshipEngagement['growthPlan']['value']>;
type PNP = NonNullable<LanguageEngagement['pnp']['value']>;

export type FilesActionItem =
  | File
  | Directory
  | ProjectDirectoryDirectory
  | ProjectDirectoryFile
  | FileVersion
  | GrowthPlan
  | PNP;

export type FileActionItem = File | ProjectDirectoryFile | GrowthPlan | PNP;
export type VersionActionItem = FileVersion;
export type NonVersionActionItem = Exclude<FilesActionItem, VersionActionItem>;
export type DirectoryActionItem = Directory | ProjectDirectoryDirectory;
export type NonDirectoryActionItem = Exclude<
  FilesActionItem,
  DirectoryActionItem
>;

export const isFileVersion = (
  fileNode: FilesActionItem
): fileNode is VersionActionItem => fileNode.__typename === 'FileVersion';

export enum FileAction {
  Rename = 'rename',
  Download = 'download',
  History = 'history',
  NewVersion = 'new version',
  Delete = 'delete',
}

interface VersionActionPayload {
  item: FileActionItem;
  actions: FileAction[];
}

interface ActionClickParams {
  action: Exclude<FileAction, FileAction.NewVersion | FileAction.History>;
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

export const FileActionsContextProvider: FC = (props) => {
  const { children } = props;
  const [previewPage, setPreviewPage] = useState(1);

  const downloadFile = useDownloadFile();

  const [renameState, renameFile, fileNodeToRename] = useDialog<
    FilesActionItem
  >();

  const [versionState, showVersions, versionToView] = useDialog<
    VersionActionPayload
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
