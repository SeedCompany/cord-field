import { FileAction } from './FileAction.enum';

export const getPermittedFileActions = (canRead: boolean, canEdit: boolean) => {
  const readFileActions = canRead
    ? [FileAction.History, FileAction.Download]
    : [];
  const editFileActions = canEdit
    ? [FileAction.Rename, FileAction.Delete, FileAction.NewVersion]
    : [];
  return [...readFileActions, ...editFileActions];
};
