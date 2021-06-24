import { useQuery } from '@apollo/client';
import * as React from 'react';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentChangeset } from '../../../api';
import { ChangesetDiffContext } from '../../../components/Changeset';
import { useDialog } from '../../../components/Dialog';
import { ProjectChangeRequestBanner } from '../ChangeRequest/ProjectChangeRequestBanner';
import {
  UpdateProjectChangeRequest,
  UpdateProjectChangeRequestFormParams,
} from '../ChangeRequest/Update';
import { ProjectChangesetDiffDocument } from './ProjectChangesetDiff.generated';

export const ProjectDetailWrapper: FC = ({ children }) => {
  const { projectId = '' } = useParams();
  const [changeset, setChangeset] = useCurrentChangeset();
  const { data } = useQuery(ProjectChangesetDiffDocument, {
    variables: {
      id: projectId,
      changeset: changeset ?? '',
    },
    skip: !changeset,
  });

  const [updateDialogState, openUpdateDialog, requestBeingUpdated] =
    useDialog<UpdateProjectChangeRequestFormParams>();

  return (
    <ChangesetDiffContext.Provider value={data?.project.changeset?.difference}>
      <ProjectChangeRequestBanner
        changesetId={changeset}
        changeset={data?.project.changeset}
        onEdit={() =>
          data?.project.changeset &&
          openUpdateDialog({
            project: data.project,
            changeRequest: data.project.changeset,
          })
        }
        onClose={() => setChangeset(null)}
      />
      {requestBeingUpdated && (
        <UpdateProjectChangeRequest
          {...updateDialogState}
          {...requestBeingUpdated}
        />
      )}
      {children}
    </ChangesetDiffContext.Provider>
  );
};
