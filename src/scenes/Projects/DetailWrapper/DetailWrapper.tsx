import { useQuery } from '@apollo/client';
import * as React from 'react';
import { FC, useEffect } from 'react';
import {
  EXPERIMENTAL_currentChangesetVar as currentChangesetVar,
  EXPERIMENTAL_useCurrentChangeset as useCurrentChangeset,
} from '../../../api';
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
  const { projectId, changesetId } = useProjectId();
  const [_, setChangeset] = useCurrentChangeset();
  const { data } = useQuery(ProjectChangesetDiffDocument, {
    variables: {
      id: projectId,
      changeset: changesetId ?? '',
    },
    skip: !changesetId,
  });

  useEffect(() => {
    currentChangesetVar(changesetId);
    return () => {
      currentChangesetVar(null);
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
        onClose={() => setChangeset(null)}
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
