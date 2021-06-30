import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useProjectId } from '../useProjectId';
import { ProjectRootDirectoryDocument } from './ProjectFiles.generated';

export const useProjectCurrentDirectory = () => {
  const { projectId, changesetId } = useProjectId();
  const { folderId } = useParams() as {
    folderId?: string;
  };
  const { data, loading } = useQuery(ProjectRootDirectoryDocument, {
    variables: {
      id: projectId,
      changeset: changesetId,
    },
  });
  const project = data?.project;
  const canRead = data?.project.rootDirectory.canRead;
  const rootDirectoryId = data?.project.rootDirectory.value?.id;
  const directoryId = folderId ?? rootDirectoryId ?? '';
  return { loading, canRead, project, directoryId, rootDirectoryId };
};
