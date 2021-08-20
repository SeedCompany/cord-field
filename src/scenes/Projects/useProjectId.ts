import { useLocation, useParams } from 'react-router-dom';
import { hasChangeset, IdFragment } from '../../api';
import { useNavigate } from '../../components/Routing';
import { useBetaFeatures } from '../../components/Session';

export const useProjectId = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  let { projectId: projectAndChangesetId = '' } = useParams();
  // eslint-disable-next-line prefer-const -- false positive
  let [projectId = '', changesetId = null] = projectAndChangesetId.split('~');
  if (!useBetaFeatures()) {
    projectAndChangesetId = projectId;
    changesetId = null;
  }
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
