import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { ChildrenProp } from '~/common';
import { ChangesetDiffProvider } from '~/components/Changeset/ChangesetDiffContext';
import { ProjectChangesetDiffsDocument } from '~/components/Changeset/ProjectChangesetDiff.graphql';
import { inChangesetVar } from '../../api';
import { useProjectId } from './useProjectId';

/**
 * Fetches and holds the changeset diff from the changeset ID referenced in the url.
 * This has to be used in a spot where an ID with changeset is already in context.
 */
// TODO: not  sure if this is a good idea, might be adding a layer of
//    complicated-ness that we don't need. Should this just be fetched from the
//    ProjectOverview instead? Are we going to need this "context" anywhere else?
export const ProjectChangesetDiff = ({ children }: ChildrenProp) => {
  const { projectId, changesetId } = useProjectId();

  const { data } = useQuery(ProjectChangesetDiffsDocument, {
    variables: {
      id: projectId,
      changeset: changesetId ?? '',
    },
    skip: !changesetId,
  });

  useEffect(() => {
    inChangesetVar(!!changesetId);
    return () => {
      inChangesetVar(false);
    };
  }, [changesetId]);

  return (
    <ChangesetDiffProvider value={data?.project.changesetDiff}>
      {children}
    </ChangesetDiffProvider>
  );
};
