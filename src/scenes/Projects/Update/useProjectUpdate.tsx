import { ApolloCache } from '@apollo/client';
import { Project } from '../../../api';
import { ProjectOverviewFragmentDoc } from '../Overview/ProjectOverview.generated';

export const updateProjectReportsCache = (
  cache: ApolloCache<unknown>,
  project: Project
) => {
  const cached = cache.readFragment({
    id: cache.identify(project),
    fragment: ProjectOverviewFragmentDoc,
    fragmentName: 'ProjectOverview',
  });
  if (!cached) {
    return;
  }
  cache.modify({
    id: cache.identify(cached),
    fields: {
      financialReports(prev, { DELETE }) {
        return DELETE;
      },
      narrativeReports(prev, { DELETE }) {
        return DELETE;
      },
    },
  });
  cache.writeFragment({
    id: cache.identify(cached),
    fragment: ProjectOverviewFragmentDoc,
    fragmentName: 'ProjectOverview',
    data: {
      ...cached,
      ...project,
    },
  });
};
