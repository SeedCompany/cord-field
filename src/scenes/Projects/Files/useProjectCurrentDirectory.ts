import { useParams } from 'react-router-dom';
import { useProjectRootDirectoryQuery } from './ProjectFiles.generated';

export const useProjectCurrentDirectory = () => {
  const { projectId, folderId } = useParams() as {
    projectId: string;
    folderId?: string;
  };
  const { data, loading } = useProjectRootDirectoryQuery({
    variables: {
      id: projectId,
    },
  });
  const project = data?.project;
  const canRead = data?.project.rootDirectory.canRead;
  const rootDirectoryId = data?.project.rootDirectory.value?.id;
  const directoryId = folderId ?? rootDirectoryId ?? '';
  return { loading, canRead, project, directoryId, rootDirectoryId };
};
