import { DialogContent, Stack, Typography } from '@mui/material';
import { StyleProps } from '~/common';
import { PreviewIconButton } from '~/components/files/FileActions/PreviewIconButton';
import { PnPValidation } from '~/components/PnpValidation/PnpValidation';
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
        <PreviewIconButton file={engagement.pnp.value} />
        {engagement.pnpExtractionResult && (
          <PnPValidation
            result={engagement.pnpExtractionResult}
            slots={{
              dialogContent: ({ children }) => (
                <DialogContent dividers sx={{ p: 1 }}>
                  {children}
                </DialogContent>
              ),
            }}
          />
        )}
      </>
    )}
  </Stack>
);
