import { useMutation } from '@apollo/client';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { GtlReportStatusLabels } from '~/api/schema/enumLists';
import { labelFrom, type RichTextJson } from '~/common';
import { Form } from '../../../components/form';
import { RichTextField } from '../../../components/RichText';
import {
  ExecuteGtlReportTransitionDocument,
  type GtlReportDetailFragment,
} from '../Detail/GtlReportDetail.graphql';

/**
 * The last step: where the report moves on.
 *
 * The transitions come from the API rather than being listed here — which ones
 * exist depends on the current state, and which are executable depends on the
 * viewer's role. Supervisor sign-off in particular is executable by the
 * assigned supervisor or by the FPM on their behalf, and that rule lives
 * server-side.
 *
 * Notes travel with the transition rather than living on the report, so a
 * reject-and-resubmit round trip keeps both sides of the conversation instead
 * of overwriting one field.
 */
export const SubmitStep = ({ report }: { report: GtlReportDetailFragment }) => {
  const [execute, { loading }] = useMutation(
    ExecuteGtlReportTransitionDocument
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Submit Report
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This report is currently{' '}
          <strong>
            {report.status.value
              ? labelFrom(GtlReportStatusLabels)(report.status.value)
              : 'unknown'}
          </strong>
          .
        </Typography>

        {report.transitions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            There is nothing further to do with this report.
          </Typography>
        ) : (
          <Form<{ notes?: RichTextJson }> onSubmit={() => undefined}>
            {({ values }) => (
              <>
                <RichTextField
                  name="notes"
                  label="Additional comments"
                  helperText="Optional. Kept with this step of the report's history."
                />

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mt: 2 }}
                >
                  {report.transitions.map((t) => (
                    <Button
                      key={t.key}
                      variant={t.type === 'Approve' ? 'contained' : 'outlined'}
                      color={t.type === 'Reject' ? 'error' : 'primary'}
                      disabled={!t.canExecute || loading}
                      onClick={() =>
                        void execute({
                          variables: {
                            input: {
                              report: report.id,
                              transition: t.key,
                              notes: values.notes,
                            },
                          },
                        })
                      }
                    >
                      {t.label}
                    </Button>
                  ))}
                </Stack>
              </>
            )}
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
