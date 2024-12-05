import { Preview as PreviewIcon } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { StyleProps } from '~/common';
import { Feature } from '~/components/Feature';
import {
  NonDirectoryActionItem as File,
  useFileActions,
} from '~/components/files/FileActions';
import { PnPValidationIcon } from '../../../ProgressReports/PnpValidation/PnpValidationIcon';
import { EngagementPlanningSpreadsheetFragment } from './PlanningSpreadsheet.graphql';

interface PlanningSpreadsheetHeaderProps extends StyleProps {
  engagement: EngagementPlanningSpreadsheetFragment;
}

export const PlanningSpreadsheetHeader = ({
  engagement,
}: PlanningSpreadsheetHeaderProps) => (
  <Stack
    sx={{
      mt: -1,
      flexDirection: 'row',
      gap: 1,
      alignItems: 'center',
    }}
  >
    <Typography variant="h4">Planning Spreadsheet</Typography>
    {engagement.pnp.value && (
      <>
        <Preview file={engagement.pnp.value} />
        <Feature
          flag="pnp-validation"
          match={true}
          sx={{
            display: 'inherit',
            flexDirection: 'inherit',
            gap: 'inherit',
          }}
        >
          {engagement.pnpExtractionResult && (
            <PnPValidationIcon
              file={engagement.pnp.value}
              result={engagement.pnpExtractionResult}
              engagement={engagement}
              size="small"
            />
          )}
        </Feature>
      </>
    )}
  </Stack>
);

export const Preview = ({ file }: { file: File }) => {
  const { openFilePreview } = useFileActions();
  return (
    <Tooltip title="Preview">
      <IconButton onClick={() => openFilePreview(file)} size="small">
        <PreviewIcon />
      </IconButton>
    </Tooltip>
  );
};
