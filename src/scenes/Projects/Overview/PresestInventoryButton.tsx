import { useMutation } from '@apollo/client';
import { Typography } from '@material-ui/core';
import React, { FC } from 'react';
import {
  readFragment,
  RecalculateChangesetDiffFragmentDoc as RecalculateChangesetDiff,
} from '../../../api';
import { IconButton } from '../../../components/IconButton';
import {
  PresetInventoryIconFilled,
  PresetInventoryIconOutlined,
} from '../../../components/Icons';
import { PaperTooltip } from '../../../components/PaperTooltip';
import { UpdateProjectDocument } from '../Update/UpdateProject.generated';
import { ProjectOverviewFragment } from './ProjectOverview.generated';

export interface PresetInventoryButtonProps {
  project?: ProjectOverviewFragment;
  className?: string;
}

export const PresetInventoryButton: FC<PresetInventoryButtonProps> = ({
  project,
  className,
}) => {
  const [updateProject, { client }] = useMutation(UpdateProjectDocument);
  const presetInventory = project?.presetInventory.value;
  return (
    <PaperTooltip
      title={
        <Typography variant="body2">
          This project and its associated languages (via engagements) are{' '}
          {presetInventory ? '' : <em>NOT</em>} apart of our{' '}
          <em>Preset&nbsp;Inventory</em> {presetInventory ? '✅' : '❌'}
          <br />
          <br />
          This indicates the project/language(s) will be exposed to major
          investors to directly fund.
          <br />
          It also means the project is committed to having quality, consistent
          reporting.
        </Typography>
      }
    >
      <IconButton
        aria-label={`${
          presetInventory ? 'Remove' : 'Add'
        } project to Preset Inventory`}
        className={className}
        onClick={async () => {
          if (!project || !project.presetInventory.canEdit) {
            return;
          }

          // If we have a changeset, fetch (from cache) the additional
          // data required to provide an optimistic response.
          // We need this because in our update operation we ask for the
          // API to send back the updated diff. Because of this Apollo
          // wants the updated diff, so we'll tell it that optimistically
          // it is unchanged. The actual API result still overrides this
          // when we get it.
          const cachedChangeset = project.changeset
            ? readFragment(client.cache, {
                fragment: RecalculateChangesetDiff,
                object: project,
              })?.changeset
            : null;

          await updateProject({
            variables: {
              input: {
                project: {
                  id: project.id,
                  presetInventory: !presetInventory,
                },
                changeset: project.changeset?.id,
              },
            },
            optimisticResponse:
              project.changeset && !cachedChangeset
                ? // If we are in a changeset, but we cannot get the required
                  // data from cache, then skip the optimistic response.
                  undefined
                : {
                    updateProject: {
                      __typename: 'UpdateProjectOutput',
                      project: {
                        ...project,
                        changeset: cachedChangeset,
                        presetInventory: {
                          ...project.presetInventory,
                          value: !presetInventory,
                        },
                      },
                    },
                  },
          });
        }}
        loading={!project}
      >
        {presetInventory ? (
          <PresetInventoryIconFilled />
        ) : (
          <PresetInventoryIconOutlined />
        )}
      </IconButton>
    </PaperTooltip>
  );
};
