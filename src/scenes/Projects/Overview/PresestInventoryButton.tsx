import { useMutation } from '@apollo/client';
import { Tooltip } from '@material-ui/core';
import React, { FC } from 'react';
import { IconButton } from '../../../components/IconButton';
import {
  PresetInventoryIconFilled,
  PresetInventoryIconOutlined,
} from '../../../components/Icons';
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
    <Tooltip title="This indicates the project/language(s) will be exposed to major investors to directly fund.">
      <IconButton
        aria-label="edit project presetInventory"
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
    </Tooltip>
  );
};
