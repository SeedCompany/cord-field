import { ApolloCache } from '@apollo/client';
import { FileVersionsDocument, FileVersionsQuery } from './FileActions';
import { FileNodeInfoFragment } from './files.generated';

export const updateCachedVersions = <MutationData>(
  cache: ApolloCache<MutationData>,
  existingVersions: readonly FileNodeInfoFragment[],
  parentId: string
) => {
  console.log('parentId', parentId);
  const response = cache.readQuery<FileVersionsQuery>({
    query: FileVersionsDocument,
    variables: { id: parentId },
  });
  console.log('response', response);
  if (response) {
    const updatedData = {
      ...response,
      file: {
        ...response.file,
        children: {
          ...response.file.children,
          items: existingVersions,
        },
      },
    };
    cache.writeQuery<FileVersionsQuery>({
      query: FileVersionsDocument,
      variables: { id: parentId },
      data: updatedData,
    });
  }
};
