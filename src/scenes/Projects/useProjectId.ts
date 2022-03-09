import { IdFragment } from '../../api';
import {
  idForUrl,
  useChangesetAwareIdFromUrl,
} from '../../components/Changeset/useChangesetAwareIdFromUrl';

export const useProjectId = () => {
  const { mergedId, id, ...rest } = useChangesetAwareIdFromUrl('projectId');
  return {
    projectUrl: `/projects/${mergedId}`,
    projectId: id,
    ...rest,
  };
};

export const getProjectUrl = (data: IdFragment) =>
  `/projects/${idForUrl(data)}`;
