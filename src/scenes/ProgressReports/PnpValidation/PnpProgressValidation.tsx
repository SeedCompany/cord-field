import { Alert, DialogContent } from '@mui/material';
import { StyleProps } from '../../../common';
import { ProblemTree } from '../../../components/PnpValidation/PnPExtractionProblems';
import { PnPValidation } from '../../../components/PnpValidation/PnpValidation';
import { ProblemsWithSheetsAsTabs } from '../../../components/PnpValidation/ProblemsWithSheetsAsTabs';
import { Link } from '../../../components/Routing';
import { PnpProgressValidationFragment } from './pnpProgressValidation.graphql';

export const PnpProgressValidation = ({
  report,
}: {
  report: PnpProgressValidationFragment;
}) => {
  if (!report.pnpExtractionResult) {
    return null;
  }
  return (
    <PnPValidation
      result={report.pnpExtractionResult}
      slots={{
        dialogContent: (props) => (
          <DialogContent
            {...props}
            dividers
            sx={{ p: 0, mt: -2, borderTop: 'none' }}
          />
        ),
        problems: (props) => (
          <ProblemsWithSheetsAsTabs {...props}>
            {({ sheet, problems }) => (
              <>
                {sheet === 'Planning' && (
                  <AdjustOnPlanningNote
                    engagement={report.parent}
                    sx={{ mb: 1 }}
                  />
                )}
                <ProblemTree problems={problems} />
              </>
            )}
          </ProblemsWithSheetsAsTabs>
        ),
      }}
    />
  );
};

const AdjustOnPlanningNote = ({
  engagement,
  ...rest
}: { engagement: { id: string } } & StyleProps) => (
  <Alert severity="info" {...rest}>
    Once these problems are fixed, the updated file needs to be uploaded on the{' '}
    <Link to={`/engagements/${engagement.id}`} color="inherit">
      Planning Spreadsheet
    </Link>{' '}
    to synchronize the changes for the planned goals.
    <br />
    And then uploaded on the <em>PnP File</em> for <strong>this</strong> report,
    to synchronize the progress of these planned goals.
  </Alert>
);
