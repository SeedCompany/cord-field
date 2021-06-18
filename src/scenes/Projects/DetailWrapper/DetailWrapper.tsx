import { useQuery } from '@apollo/client';
import * as React from 'react';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentChangeset } from '../../../api';
import {
  ChangesetBanner,
  ChangesetDiffContext,
} from '../../../components/Changeset';
import { ProjectChangesetDiffDocument } from './ProjectChangesetDiff.generated';

export const ProjectDetailWrapper: FC = ({ children }) => {
  const { projectId = '' } = useParams();
  const [changeset] = useCurrentChangeset();
  const { data } = useQuery(ProjectChangesetDiffDocument, {
    variables: {
      id: projectId,
      changeset: changeset ?? '',
    },
    skip: !changeset,
  });

  return (
    <ChangesetDiffContext.Provider value={data?.project.changeset?.difference}>
      <ChangesetBanner />
      {children}
    </ChangesetDiffContext.Provider>
  );
};
