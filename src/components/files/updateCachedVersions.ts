import { ApolloCache } from '@apollo/client';
import { FileVersionsDocument, FileVersionsQuery } from './FileActions';
import { FileNodeInfoFragment } from './files.generated';

export const updateCachedVersions = <MutationData>(
  cache: ApolloCache<MutationData>,
  existingVersions: readonly FileNodeInfoFragment[],
  parentId: string
) => {
  try {
    const response = cache.readQuery<FileVersionsQuery>({
      query: FileVersionsDocument,
      variables: { id: parentId },
    });
    if (response) {
      const updatedData = {
        ...response,
        file: {
          ...response.file,
          children: {
            ...response.file.children,
            items: existingVersions,
            total: existingVersions.length,
          },
        },
      };
      cache.writeQuery<FileVersionsQuery>({
        query: FileVersionsDocument,
        variables: { id: parentId },
        data: updatedData,
      });
    }
  } catch {
    /**
     * We need this try/catch because if this data has never been fetched
     * before, `cache.readQuery` will throw an error instead of returning
     * anything, which is apparently a behavior the Apollo team finds
     * acceptable.
     */
    return;
  }
};
