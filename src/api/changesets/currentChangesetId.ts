import { makeVar, useReactiveVar } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { useNavigate } from '../../components/Routing';
import { useProjectId } from '../../scenes/Projects/useProjectId';

/**
 * WARNING: Don't use directly.
 * Currently only used to sync global state with project context.
 */
export const EXPERIMENTAL_currentChangesetVar = makeVar<string | null>(null);

/**
 * WARNING: You probably don't want to use this directly.
 * Prefer using the changeset from an actual changeset aware object if you have it.
 * If needing ID from query, it should be fetched from URL path like with {@link useProjectId}
 */
export const EXPERIMENTAL_useCurrentChangeset = () => {
  const current = useReactiveVar(EXPERIMENTAL_currentChangesetVar);
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
