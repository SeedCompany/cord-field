import { useQuery } from '@apollo/client';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ChildrenProp } from '~/common';
import { inChangesetVar } from '../../api';
import {
  UpdateProjectChangeRequest,
  UpdateProjectChangeRequestFormParams,
} from '../../scenes/Projects/ChangeRequest/Update';
import { useDialog } from '../Dialog';
import { ChangesetBanner } from './ChangesetBanner';
import { ChangesetDiffDocument } from './ChangesetDiff.graphql';
import { ChangesetDiffProvider } from './ChangesetDiffContext';
import { useChangesetAwareIdFromUrl } from './useChangesetAwareIdFromUrl';

/**
 * Fetches and holds the changeset diff from the changeset ID referenced in the url.
 * It displays the changeset banner before its children.
 * This has to be used in a spot where an ID with changeset is already in context.
 */
export const ChangesetContext = ({ children }: ChildrenProp) => {
  const params = useParams();
  // First route param key with a ~ in its value
  const key = useMemo(
    () => Object.entries(params).find(([_, val]) => val?.includes('~'))?.[0],
    [params]
  );
  const { changesetId, closeChangeset } = useChangesetAwareIdFromUrl(key ?? '');
  const { data } = useQuery(ChangesetDiffDocument, {
    variables: {
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

  const handleEdit = data?.changeset
    ? () => {
        openUpdateDialog({
          project: data.changeset.project,
          changeRequest: data.changeset,
        });
      }
    : undefined;

  return (
    <ChangesetDiffProvider value={data?.changeset.difference}>
      <ChangesetBanner
        changesetId={changesetId}
        onEdit={handleEdit}
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
