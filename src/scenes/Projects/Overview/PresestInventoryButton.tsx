import { useMutation } from '@apollo/client';
import { Typography } from '@material-ui/core';
import React, { FC } from 'react';
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
  const [updateProject] = useMutation(UpdateProjectDocument);
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
