import { useLocation, useParams } from 'react-router-dom';
import { hasChangeset, IdFragment } from '../../api';
import { useNavigate } from '../../components/Routing';

export const useProjectId = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { projectId: projectAndChangesetId = '' } = useParams();
  const [projectId = '', changesetId = null] = projectAndChangesetId.split('~');
  return {
    projectUrl: `/projects/${projectAndChangesetId}`,
    projectId,
    changesetId,
    closeChangeset: (): void =>
      changesetId
        ? navigate(pathname.replace(`${projectId}~${changesetId}`, projectId))
        : void 0,
  };
};

export const getProjectUrl = (data: IdFragment) =>
  `/projects/${data.id}${hasChangeset(data) ? `~${data.changeset.id}` : ''}`;
