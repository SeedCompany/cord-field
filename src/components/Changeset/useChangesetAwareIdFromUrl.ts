import { useLocation, useParams } from 'react-router-dom';
import { hasChangeset } from '~/api';
import { IdFragment } from '~/common';
import { useNavigate } from '../Routing';
import { useBetaFeatures } from '../Session';

export const useChangesetAwareIdFromUrl = (paramName: string) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  let { [paramName]: objAndChangesetId = '' } = useParams();
  // eslint-disable-next-line prefer-const -- false positive
  let [id = '', changesetId] = objAndChangesetId.split('~');
  if (!useBetaFeatures().has('projectChangeRequests')) {
    objAndChangesetId = id;
    changesetId = undefined;
  }
  return {
    mergedId: objAndChangesetId,
    id,
    changesetId,
    closeChangeset: (): void =>
      changesetId
        ? navigate(pathname.replace(`${id}~${changesetId}`, id))
        : void 0,
  };
};

export const idForUrl = (data: IdFragment) =>
  `${data.id}${hasChangeset(data) ? `~${data.changeset.id}` : ''}`;
