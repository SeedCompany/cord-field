import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { ChildrenProp } from '~/common';
import { ChangesetContext } from '~/components/Changeset';
import { ProjectChangesetDiffsDocument } from '~/components/Changeset/ProjectChangesetDiff.graphql';
import { inChangesetVar } from '../../api';
import { useProjectId } from './useProjectId';

/**
 * Fetches and holds the changeset diff from the changeset ID referenced in the url.
 * It displays the changeset banner before its children.
 * This has to be used in a spot where an ID with changeset is already in context.
 */
export const ProjectChangesetContext = ({ children }: ChildrenProp) => {
  const { projectId, changesetId } = useProjectId();

  const { data, loading } = useQuery(ProjectChangesetDiffsDocument, {
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
    <ChangesetContext
      project={{ id: projectId }}
      changeset={data?.project.changeset}
      changesetDiff={data?.project.changesetDiff}
    >
      {children}
    </ChangesetContext>
  );
};
