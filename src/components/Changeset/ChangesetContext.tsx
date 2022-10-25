import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ChildrenProp } from '~/common';
import { inChangesetVar } from '../../api';
import { ChangesetDiffFragment as Diff } from '../../common/fragments';
import {
  UpdateProjectChangeRequest,
  UpdateProjectChangeRequestFormParams,
} from '../../scenes/Projects/ChangeRequest/Update';
import { useDialog } from '../Dialog';
import { ProjectChangeRequestListItemFragment as ProjectChangeRequest } from '../ProjectChangeRequestListItem';
import { ChangesetBanner } from './ChangesetBanner';
import { ChangesetDiffProvider } from './ChangesetDiffContext';
import { useChangesetAwareIdFromUrl } from './useChangesetAwareIdFromUrl';

type ChangesetContextProps = {
  changesetDiff?: Diff | null;
  changeset?: ProjectChangeRequest | null;
  project: {
    __typename?: 'TranslationProject' | 'InternshipProject';
    id: string;
  };
} & ChildrenProp;
/**
 * Fetches and holds the changeset diff from the changeset ID referenced in the url.
 * It displays the changeset banner before its children.
 * This has to be used in a spot where an ID with changeset is already in context.
 */
export const ChangesetContext = (props: ChangesetContextProps) => {
  const params = useParams();
  // First route param key with a ~ in its value
  const key = useMemo(
    () => Object.entries(params).find(([_, val]) => val?.includes('~'))?.[0],
    [params]
  );
  const { changesetId, closeChangeset } = useChangesetAwareIdFromUrl(key ?? '');

  useEffect(() => {
    inChangesetVar(!!changesetId);
    return () => {
      inChangesetVar(false);
    };
  }, [changesetId]);

  const [updateDialogState, openUpdateDialog, requestBeingUpdated] =
    useDialog<UpdateProjectChangeRequestFormParams>();

  const projectChangeRequest = props.changeset;

  const handleEdit = projectChangeRequest
    ? () => {
        openUpdateDialog({
          project: props.project,
          changeRequest: projectChangeRequest,
        });
      }
    : undefined;

  return (
    <ChangesetDiffProvider value={props.changesetDiff}>
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
      {props.children}
    </ChangesetDiffProvider>
  );
};
