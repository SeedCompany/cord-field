import { useMutation } from '@apollo/client';
import { Typography } from '@mui/material';
import { readFragment } from '../../../../api';
import { IconButton } from '../../../../components/IconButton';
import {
  PresetInventoryIconFilled,
  PresetInventoryIconOutlined,
} from '../../../../components/Icons';
import { PaperTooltip } from '../../../../components/PaperTooltip';
import { ProjectOverviewFragment } from '../ProjectOverview.graphql';
import {
  RecalculatePresetInventoryFragmentDoc as RecalculatePresetInventory,
  TogglePresetInventoryDocument as TogglePresetInventory,
} from './TogglePresetInventory.graphql';

export interface PresetInventoryButtonProps {
  project?: ProjectOverviewFragment;
  className?: string;
}

export const PresetInventoryButton = ({
  project,
  className,
}: PresetInventoryButtonProps) => {
  const [updateProject, { client }] = useMutation(TogglePresetInventory);
  const presetInventory = project?.presetInventory.value;

  const toggle = () => {
    if (!project?.presetInventory.canEdit) {
      return;
    }

    // Fetch (from cache) the additional data required to provide an optimistic
    // response to this mutation.
    const cached = readFragment(client.cache, {
      fragment: RecalculatePresetInventory,
      object: project,
    });

    void updateProject({
      variables: {
        input: {
          project: {
            id: project.id,
            presetInventory: !presetInventory,
          },
          changeset: project.changeset?.id,
        },
      },
      // If we have the required data from cache, then give an optimistic response.
      optimisticResponse: cached
        ? {
            updateProject: {
              __typename: 'UpdateProjectOutput',
              project: {
                ...cached,
                presetInventory: {
                  ...cached.presetInventory,
                  value: !presetInventory,
                },
                // If preset inventory is true, we know that all associated
                // languages will be true as well
                // Otherwise leave them as is and let the server tell us.
                engagements: !presetInventory
                  ? {
                      ...cached.engagements,
                      items: cached.engagements.items.map((eng) =>
                        eng.__typename === 'LanguageEngagement'
                          ? {
                              ...eng,
                              language: {
                                ...eng.language,
                                value: eng.language.value
                                  ? {
                                      ...eng.language.value,
                                      presetInventory: {
                                        ...eng.language.value.presetInventory,
                                        value: eng.language.value
                                          .presetInventory.canRead
                                          ? true
                                          : null,
                                      },
                                    }
                                  : null,
                              },
                            }
                          : eng
                      ),
                    }
                  : cached.engagements,
              },
            },
          }
        : undefined,
    });
  };

  return (
    <PaperTooltip
      title={
        <Typography variant="body2" component="div">
          This project and its associated languages (via engagements) are{' '}
          {presetInventory ? '' : <em>NOT</em>} a part of our{' '}
          <em>Preset&nbsp;Inventory</em> {presetInventory ? '✅' : '❌'}
          <br />
          <hr />
          <em>Preset Inventory</em> indicates the project/language(s) will be
          exposed to major investors to directly fund.
          <br />
          <em>Preset Inventory</em> projects are committed to having quality,
          consistent reporting.
        </Typography>
      }
    >
      <IconButton
        aria-label={`${
          presetInventory ? 'Remove' : 'Add'
        } project to Preset Inventory`}
        className={className}
        onClick={toggle}
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
