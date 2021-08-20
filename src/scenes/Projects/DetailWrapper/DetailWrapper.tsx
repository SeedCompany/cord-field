import { useQuery } from '@apollo/client';
import * as React from 'react';
import { FC, useEffect } from 'react';
import { inChangesetVar } from '../../../api';
import { ChangesetDiffProvider } from '../../../components/Changeset';
import { useDialog } from '../../../components/Dialog';
import { ProjectChangeRequestBanner } from '../ChangeRequest/ProjectChangeRequestBanner';
import {
  UpdateProjectChangeRequest,
  UpdateProjectChangeRequestFormParams,
} from '../ChangeRequest/Update';
import { useProjectId } from '../useProjectId';
import { ProjectChangesetDiffDocument } from './ProjectChangesetDiff.generated';

export const ProjectDetailWrapper: FC = ({ children }) => {
  const { projectId, changesetId, closeChangeset } = useProjectId();
  const { data } = useQuery(ProjectChangesetDiffDocument, {
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

  const [updateDialogState, openUpdateDialog, requestBeingUpdated] =
    useDialog<UpdateProjectChangeRequestFormParams>();

  return (
    <ChangesetDiffProvider value={data?.project.changeset?.difference}>
      <ProjectChangeRequestBanner
        changesetId={changesetId}
        changeset={data?.project.changeset}
        onEdit={() =>
          data?.project.changeset &&
          openUpdateDialog({
            project: data.project,
            changeRequest: data.project.changeset,
          })
        }
        onClose={closeChangeset}
      />
      {requestBeingUpdated && (
        <UpdateProjectChangeRequest
          {...updateDialogState}
          {...requestBeingUpdated}
        />
      )}
      {children}
    </ChangesetDiffProvider>
  );
};
