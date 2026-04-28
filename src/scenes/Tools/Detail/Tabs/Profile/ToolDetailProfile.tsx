import { Stack } from '@mui/material';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { TabPanelContent } from '~/components/Tabs';
import type { ToolProfileFragment } from '../../ToolDetail.graphql';

interface ToolDetailProfileProps {
  tool?: ToolProfileFragment;
}

export const ToolDetailProfile = ({ tool }: ToolDetailProfileProps) => {
  const { description, aiBased } = tool ?? {};

  return (
    <TabPanelContent>
      <Stack sx={{ p: 2, gap: 2 }}>
        <DisplayProperty
          label="Description"
          value={description?.value}
          loading={!tool}
        />
        <DisplayProperty
          label="Is this AI based?"
          value={
            aiBased?.value != null ? (aiBased.value ? 'Yes' : 'No') : undefined
          }
          loading={!tool}
        />
      </Stack>
    </TabPanelContent>
  );
};

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      {...{ component: 'div' }}
      {...props}
      loadingWidth="20ch"
      LabelProps={{
        color: 'textSecondary',
        variant: 'body2',
        ...props.LabelProps,
      }}
      ValueProps={{
        color: 'textPrimary',
        ...props.ValueProps,
      }}
    />
  );
