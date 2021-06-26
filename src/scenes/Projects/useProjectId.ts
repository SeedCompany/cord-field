import { useParams } from 'react-router-dom';
import { hasChangeset, IdFragment } from '../../api';

export const useProjectId = () => {
  const { projectId: projectAndChangesetId = '' } = useParams();
  const [projectId = '', changesetId = null] = projectAndChangesetId.split('~');
  return {
    projectUrl: `/projects/${projectAndChangesetId}`,
    projectId,
    changesetId,
  };
};

export const getProjectUrl = (data: IdFragment) =>
  `/projects/${data.id}${hasChangeset(data) ? `~${data.changeset.id}` : ''}`;
