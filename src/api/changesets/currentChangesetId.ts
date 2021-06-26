import { makeVar, useReactiveVar } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { useNavigate } from '../../components/Routing';
import { useProjectId } from '../../scenes/Projects/useProjectId';

export const currentChangesetVar = makeVar<string | null>(null);

export const useCurrentChangeset = () => {
  const current = useReactiveVar(currentChangesetVar);
  const location = useLocation();
  const navigate = useNavigate();

  // Mmmmm hack hack hack
  const { projectId, changesetId } = useProjectId();
  const setNext = (next: string | null) => {
    navigate(
      next
        ? `../../${projectId}~${next}`
        : location.pathname.replace(
            `${projectId}${changesetId ? `~${changesetId}` : ''}`,
            projectId
          )
    );
  };

  return [current, setNext] as const;
};
