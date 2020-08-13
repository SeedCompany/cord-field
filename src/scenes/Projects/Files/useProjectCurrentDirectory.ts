import { useParams } from 'react-router-dom';
import { useProjectRootDirectoryQuery } from './ProjectFiles.generated';

export const useProjectCurrentDirectory = () => {
  const { projectId, folderId } = useParams() as {
    projectId: string;
    folderId?: string;
  };
  const { data } = useProjectRootDirectoryQuery({
    variables: {
      id: projectId,
    },
  });
  const project = data?.project;
  const rootDirectoryId = data?.project.rootDirectory.id;
  const directoryId = folderId ?? rootDirectoryId ?? '';
  return { project, directoryId, rootDirectoryId };
};
