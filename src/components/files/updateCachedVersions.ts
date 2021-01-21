import { ApolloCache } from '@apollo/client';
import { FileVersionsDocument } from './FileActions';
import { FileNodeInfoFragment } from './files.generated';

export const updateCachedVersions = (
  cache: ApolloCache<unknown>,
  existingVersions: readonly FileNodeInfoFragment[],
  parentId: string
) => {
  const cachedFile = cache.readQuery({
    query: FileVersionsDocument,
    variables: { id: parentId },
  });
  if (!cachedFile) {
    return;
  }
  const updatedData = {
    ...cachedFile,
    file: {
      ...cachedFile.file,
      children: {
        ...cachedFile.file.children,
        items: existingVersions,
        total: existingVersions.length,
      },
    },
  };
  cache.writeQuery({
    query: FileVersionsDocument,
    variables: { id: parentId },
    data: updatedData,
  });
};
